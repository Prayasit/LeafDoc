
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { identifyPlant, IdentifyPlantInput, IdentifyPlantOutput } from "@/ai/flows/identify-plant";
import { detectDisease, DetectDiseaseInput, DetectDiseaseOutput } from "@/ai/flows/detect-disease";
import { getPlantCare, PlantCare, generatePlantTrivia } from "@/services/plant-care";
import { PlantChatbot } from "@/components/plant-chatbot";
import { Camera, Upload, Search, Leaf, ShieldCheck, InfoIcon, BarChart3, Lightbulb, Bot, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Define a type for the results to make state management cleaner
type IdentificationResult = IdentifyPlantOutput & { imagePreview?: string };
type DiseaseResult = DetectDiseaseOutput;
type CareInfoResult = PlantCare;

export default function AppPage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [plantNameInput, setPlantNameInput] = useState<string>("");
  const [plantDescription, setPlantDescription] = useState<string>("");

  const [identificationResult, setIdentificationResult] = useState<IdentificationResult | null>(null);
  const [diseaseResult, setDiseaseResult] = useState<DiseaseResult | null>(null);
  const [careInfoResult, setCareInfoResult] = useState<CareInfoResult | null>(null);
  
  const [plantGrowth, setPlantGrowth] = useState<number>(0);
  const [triviaFacts, setTriviaFacts] = useState<string[]>([]); // Changed to string array

  const [isLoading, setIsLoading] = useState<string | false>(false);
  const [progress, setProgress] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>("identify");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);

  const { toast } = useToast();

  const resetStateForNewIdentification = () => {
    setIdentificationResult(null);
    setDiseaseResult(null);
    setCareInfoResult(null);
    setPlantNameInput("");
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        resetStateForNewIdentification();
      };
      reader.readAsDataURL(file);
      if (isCameraOpen) stopCamera();
    }
  };

  const startCamera = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsCameraOpen(true);
          setImagePreview(null);
          setSelectedImage(null);
          resetStateForNewIdentification();
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        toast({ variant: "destructive", title: "Camera Error", description: "Could not access camera." });
        setIsCameraOpen(false);
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      canvas.toBlob(blob => {
        if (blob) {
          const file = new File([blob], "capture.png", { type: "image/png" });
          setSelectedImage(file);
          setImagePreview(canvas.toDataURL("image/png"));
          resetStateForNewIdentification();
        }
      }, "image/png");
      stopCamera();
    }
  };

  const processOperation = async (
    operation: () => Promise<any>, 
    loadingMessage: string,
    successMessage: string,
    errorMessage: string,
    setData: (data: any) => void
  ) => {
    setIsLoading(loadingMessage);
    setProgress(30);
    try {
      const result = await operation();
      setProgress(100);
      setData(result);
      toast({ title: "Success", description: successMessage, variant: "default" });
    } catch (err: any) {
      console.error(`${errorMessage} error:`, err);
      const errorDescription = err.message?.includes('503') ? "The AI model is currently overloaded. Please try again in a few moments." : (err.message || "An unknown error occurred.");
      toast({ variant: "destructive", title: errorMessage, description: errorDescription });
      setData(null);
    } finally {
      setIsLoading(false);
      setProgress(0);
    }
  };

  const handleIdentify = async () => {
  if (!selectedImage) {
    toast({ variant: "destructive", title: "No Image", description: "Please select an image to identify." });
    return;
  }

  const reader = new FileReader();
  reader.readAsDataURL(selectedImage);

  reader.onloadend = async () => {
    const photoDataUri = reader.result as string;

    const input: IdentifyPlantInput = { photoDataUri };

    await processOperation(
      () => identifyPlant(input),
      "Identifying plant...",
      "Plant identified successfully!",
      "Identification Error",
      (data: IdentifyPlantOutput | null) => {
        if (data) {
          setIdentificationResult({ ...data, imagePreview: photoDataUri });

          // ✅ updated field
          setPlantNameInput(data.commonName.replace(/^Common\s+/i, ""));
        } else {
          setIdentificationResult(null);
        }
      }
    );
  };
};

  const handleDetectDisease = async () => {
    if (!selectedImage && !identificationResult?.imagePreview) {
      toast({ variant: "destructive", title: "No Image", description: "Please identify a plant first or upload an image." });
      return;
    }
    if (!plantDescription.trim()) {
        toast({ variant: "destructive", title: "No Description", description: "Please describe the plant's symptoms." });
        return;
    }
    const currentPlantName = identificationResult?.commonName || plantNameInput;
    if (!currentPlantName) {
        toast({ variant: "destructive", title: "No Plant Name", description: "Please identify the plant or enter its name." });
        return;
    }

    const photoToUse = selectedImage || (identificationResult?.imagePreview ? await (await fetch(identificationResult.imagePreview)).blob() : null);
    if (!photoToUse) {
        toast({ variant: "destructive", title: "Image Error", description: "Could not retrieve image for disease detection." });
        return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(photoToUse);
    reader.onloadend = async () => {
      const photoDataUri = reader.result as string;
      const input: DetectDiseaseInput = { 
        photoDataUri, 
        description: plantDescription,
        plantName: currentPlantName
      };
      await processOperation(
        () => detectDisease(input),
        "Detecting disease...",
        "Disease detection complete.",
        "Disease Detection Error",
        setDiseaseResult
      );
    };
  };

  const handleGetCareInfo = async () => {
    const plantToQuery = identificationResult?.commonName || plantNameInput;
    if (!plantToQuery) {
      toast({ variant: "destructive", title: "No Plant Name", description: "Please identify a plant or enter its name." });
      return;
    }
    await processOperation(
      () => getPlantCare(plantToQuery),
      "Fetching care info...",
      "Care information retrieved.",
      "Care Info Error",
      setCareInfoResult
    );
  };

  const handleGenerateTrivia = useCallback(async () => {
    setIsLoading("Fetching trivia...");
    setProgress(30);
    try {
      const facts = await generatePlantTrivia(); // Now returns string[]
      setTriviaFacts(facts); // Set the array of facts
      setProgress(100);
    } catch (err) {
      console.error("Trivia error:", err);
      toast({ variant: "destructive", title: "Trivia Error", description: "Could not load trivia facts." });
      // Fallback is handled in generatePlantTrivia, it will return an array
      setTriviaFacts(await generatePlantTrivia()); // Call again to get fallback array
    } finally {
      setIsLoading(false);
      setProgress(0);
    }
  }, [toast]);

  useEffect(() => {
    if (activeTab === "trivia" && (!triviaFacts || triviaFacts.length === 0)) {
      handleGenerateTrivia();
    }
  }, [activeTab, triviaFacts, handleGenerateTrivia]);

  const handleTrackGrowth = () => {
    setPlantGrowth(prev => {
      const newGrowth = prev + 20;
      return newGrowth > 100 ? 100 : newGrowth;
    });
  };

  useEffect(() => {
    return () => {
      if (isCameraOpen) {
        stopCamera();
      }
    };
  }, [isCameraOpen]);

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen bg-background text-foreground">
      <header className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-primary">LeafDoc App</h1>
        <p className="text-muted-foreground mt-2 text-lg">Your AI-powered plant assistant.</p>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-6">
          <TabsTrigger value="identify" className="flex-col h-auto py-3"><Leaf className="mb-1" /> Identify</TabsTrigger>
          <TabsTrigger value="disease" className="flex-col h-auto py-3"><ShieldCheck className="mb-1" />Detect Disease</TabsTrigger>
          <TabsTrigger value="care" className="flex-col h-auto py-3"><InfoIcon className="mb-1" />Care Info</TabsTrigger>
          <TabsTrigger value="trivia" className="flex-col h-auto py-3"><Lightbulb className="mb-1" />Plant Trivia</TabsTrigger>
          <TabsTrigger value="growth" className="flex-col h-auto py-3"><BarChart3 className="mb-1" />Growth Track</TabsTrigger>
          <TabsTrigger value="chatbot" className="flex-col h-auto py-3"><Bot className="mb-1" />PlantBot</TabsTrigger>
        </TabsList>

        {isLoading && (
          <div className="my-4">
            <Progress value={progress} className="w-full" />
            <p className="text-center text-sm text-muted-foreground mt-2">{isLoading}</p>
          </div>
        )}

        <TabsContent value="identify">
          <Card className="shadow-lg rounded-xl border border-border">
            <CardHeader>
              <CardTitle className="text-2xl">Plant Identification</CardTitle>
              <CardDescription>Upload or capture an image to identify a plant.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex gap-2 flex-wrap">
                  <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="flex-grow sm:flex-grow-0">
                    <Upload className="mr-2 h-4 w-4" /> Upload Image
                  </Button>
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
                  <Button onClick={isCameraOpen ? handleCapture : startCamera} variant="outline" className="flex-grow sm:flex-grow-0">
                    <Camera className="mr-2 h-4 w-4" /> {isCameraOpen ? "Capture Photo" : "Open Camera"}
                  </Button>
                  {isCameraOpen && (
                    <Button onClick={stopCamera} variant="destructive" className="flex-grow sm:flex-grow-0">
                       Stop Camera
                    </Button>
                  )}
                </div>
              </div>

              {isCameraOpen && (
                <div className="bg-muted p-2 rounded-md border border-border">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-80 object-cover rounded-lg"></video>
                  <canvas ref={canvasRef} className="hidden"></canvas>
                </div>
              )}

              {imagePreview && (
                <div className="mt-4 text-center">
                  <Image src={imagePreview} alt="Selected plant" width={300} height={300} className="rounded-lg mx-auto shadow-md border border-border object-contain max-h-[400px]" />
                </div>
              )}
              
              <Button onClick={handleIdentify} disabled={!!isLoading || (!selectedImage && !imagePreview)} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                {isLoading === "Identifying plant..." ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                Identify Plant
              </Button>

              {identificationResult && (
<Card className="mt-6 overflow-hidden rounded-xl border border-border bg-card">

 
  <CardContent className="p-6 space-y-4">

    {/* Title */}
    <div className="flex justify-between items-center">

      <div>
        <h2 className="text-3xl font-bold">
          {identificationResult.commonName}
        </h2>

        <p className="text-muted-foreground italic">
          {identificationResult.scientificName}
        </p>

      </div>

      <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-semibold">
        {identificationResult.health}% Health
      </div>

    </div>

    {/* Region */}
    <p className="text-sm text-green-400 bg-green-900/20 px-3 py-1 rounded-md inline-block mt-2">
    {identificationResult.region}
    </p>

    {/* Description */}
    <p className="text-muted-foreground mt-3 leading-relaxed">
      {identificationResult.description}
    </p>

    {/* Care Instructions */}
    <div className="pt-4">

      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
        🌿 Care Instructions
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <Card className="p-4 bg-muted">
          <p className="text-sm text-muted-foreground">☀ SUNLIGHT</p>
          <p className="font-medium">{identificationResult.care.sunlight}</p>
        </Card>

        <Card className="p-4 bg-muted">
          <p className="text-sm text-muted-foreground">💧 WATER</p>
          <p className="font-medium">{identificationResult.care.water}</p>
        </Card>

        <Card className="p-4 bg-muted">
          <p className="text-sm text-muted-foreground">🌱 SOIL</p>
          <p className="font-medium">{identificationResult.care.soil}</p>
        </Card>

        <Card className="p-4 bg-muted">
          <p className="text-sm text-muted-foreground">🌡 TEMPERATURE</p>
          <p className="font-medium">{identificationResult.care.temperature}</p>
        </Card>

      </div>
    </div>

  </CardContent>
</Card>
)}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="disease">
          <Card className="shadow-lg rounded-xl border border-border">
            <CardHeader>
              <CardTitle className="text-2xl">Disease Detection</CardTitle>
              <CardDescription>Provide plant name, image (if not identified) and symptoms.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!identificationResult && !imagePreview && (
                 <Alert variant="default" className="border-accent text-accent-foreground">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Tip</AlertTitle>
                    <AlertDescription>
                      For best results, first identify your plant in the "Identify" tab, or upload an image here.
                    </AlertDescription>
                  </Alert>
              )}
              {(imagePreview || identificationResult?.imagePreview) && (
                 <div className="mt-4 text-center">
                  <Image src={imagePreview || identificationResult!.imagePreview!} alt="Plant for disease detection" width={200} height={200} className="rounded-lg mx-auto shadow-md border border-border object-contain max-h-[300px]" />
                </div>
              )}
              {!imagePreview && !identificationResult?.imagePreview &&
                <div className="space-y-2">
                    <label htmlFor="disease-image-upload" className="text-sm font-medium">Upload Image (Optional if not identified yet)</label>
                    <Input id="disease-image-upload" type="file" accept="image/*" onChange={handleImageChange} className="file:text-primary file:font-semibold"/>
                </div>
              }


              <div className="space-y-1.5">
                <label htmlFor="plantNameDisease" className="text-sm font-medium text-foreground/90">Plant Name</label>
                <Input
                  id="plantNameDisease"
                  type="text"
                  placeholder="e.g., Rose, Tomato Plant"
                  value={plantNameInput}
                  onChange={(e) => setPlantNameInput(e.target.value)}
                  className="bg-background border-border"
                  disabled={!!identificationResult}
                />
                {identificationResult && <p className="text-xs text-muted-foreground">Plant name pre-filled from identification.</p>}
              </div>
              <div className="space-y-1.5">
                 <label htmlFor="plantDescription" className="text-sm font-medium text-foreground/90">Plant Symptoms / Description</label>
                <Textarea
                  id="plantDescription"
                  placeholder="Describe the symptoms (e.g., yellow leaves, brown spots)"
                  value={plantDescription}
                  onChange={(e) => setPlantDescription(e.target.value)}
                  className="min-h-[100px] bg-background border-border"
                />
              </div>
              <Button onClick={handleDetectDisease} disabled={!!isLoading || (!plantDescription.trim() && (!selectedImage && !identificationResult?.imagePreview))} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                 {isLoading === "Detecting disease..." ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                Detect Disease
              </Button>

              {diseaseResult && (
                <Alert variant={diseaseResult.isDiseased ? "destructive" : "default"} className={cn("mt-4", diseaseResult.isDiseased ? "bg-destructive/10 border-destructive" : "bg-secondary/30 border-primary/50")}>
                  <ShieldCheck className={cn("h-5 w-5", diseaseResult.isDiseased ? "text-destructive" : "text-primary")} />
                  <AlertTitle className={cn("font-semibold", diseaseResult.isDiseased ? "text-destructive" : "text-primary")}>
                    Disease Detection Result
                  </AlertTitle>
                  <AlertDescription className="space-y-1 text-foreground/80">
                    <p><strong>Diseased:</strong> {diseaseResult.isDiseased ? "Yes" : "No"}</p>
                    {diseaseResult.isDiseased && (
                      <>
                        <p><strong>Disease:</strong> {diseaseResult.diseaseName || "Not specified"}</p>
                        <p><strong>Confidence:</strong> {diseaseResult.confidence ? (diseaseResult.confidence * 100).toFixed(2) + "%" : "N/A"}</p>
                        <p><strong>Suggested Treatment:</strong> {diseaseResult.suggestedTreatment || "Consult a specialist."}</p>
                      </>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="care">
          <Card className="shadow-lg rounded-xl border border-border">
            <CardHeader>
              <CardTitle className="text-2xl">Plant Care Information</CardTitle>
              <CardDescription>Get care tips for your plant.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-1.5">
                <label htmlFor="plantNameCare" className="text-sm font-medium text-foreground/90">Plant Name</label>
                <Input
                  id="plantNameCare"
                  type="text"
                  placeholder="Enter plant name (e.g., Peace Lily)"
                  value={plantNameInput}
                  onChange={(e) => setPlantNameInput(e.target.value)}
                  className="bg-background border-border"
                   disabled={!!identificationResult}
                />
                 {identificationResult && <p className="text-xs text-muted-foreground">Plant name pre-filled from identification.</p>}
              </div>
              <Button onClick={handleGetCareInfo} disabled={!!isLoading || !plantNameInput?.trim()} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                 {isLoading === "Fetching care info..." ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <InfoIcon className="mr-2 h-4 w-4" />}
                Get Care Info
              </Button>

              {careInfoResult && (
                <Alert variant="default" className="mt-4 bg-secondary/30 border-primary/50">
                  <InfoIcon className="h-5 w-5 text-primary" />
                  <AlertTitle className="font-semibold text-primary">Care Information for {careInfoResult.commonName}</AlertTitle>
                  <AlertDescription className="space-y-1 text-foreground/80">
                    <p><strong>Scientific Name:</strong> {careInfoResult.scientificName}</p>
                    <p><strong>Watering:</strong> {careInfoResult.wateringFrequency}</p>
                    <p><strong>Sunlight:</strong> {careInfoResult.sunlightNeeds}</p>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trivia">
          <Card className="shadow-lg rounded-xl border border-border">
            <CardHeader>
              <CardTitle className="text-2xl">Plant Trivia!</CardTitle>
              <CardDescription>Discover interesting facts about plants.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoading === "Fetching trivia..." && <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />}
              {triviaFacts && triviaFacts.length > 0 && !isLoading && (
                <Alert variant="default" className="bg-primary/10 border-primary/50">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  <AlertTitle className="font-semibold text-primary">Did you know?</AlertTitle>
                  <AlertDescription className="text-base text-foreground/90 space-y-2"> {/* Changed text-lg to text-base for potentially long lists */}
                    {triviaFacts.map((fact, index) => (
                      <p key={index} className="leading-relaxed">{fact}</p>
                    ))}
                  </AlertDescription>
                </Alert>
              )}
              <Button onClick={handleGenerateTrivia} disabled={!!isLoading} variant="outline" className="w-full sm:w-auto">
                {isLoading === "Fetching trivia..." ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> :  <Lightbulb className="mr-2 h-4 w-4" />}
                New Trivia Facts
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="growth">
          <Card className="shadow-lg rounded-xl border border-border">
            <CardHeader>
              <CardTitle className="text-2xl">Plant Growth Tracker</CardTitle>
              <CardDescription>Monitor your plant's progress.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <div className="w-full max-w-md mx-auto">
                <Progress value={plantGrowth} className="h-6 rounded-full bg-primary/20 border border-primary/50" />
                <p className="mt-3 text-xl font-semibold text-primary">{plantGrowth}% Grown</p>
              </div>
              <Button onClick={handleTrackGrowth} disabled={plantGrowth >= 100 || !!isLoading} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                <BarChart3 className="mr-2 h-4 w-4" /> Mark Growth Milestone (+20%)
              </Button>
              {plantGrowth >= 100 && <p className="text-green-600 font-semibold">Congratulations! Your plant has fully grown!</p>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chatbot">
          <div className="h-[calc(100vh-280px)] md:h-[calc(100vh-250px)] max-h-[700px]">
            <PlantChatbot />
          </div>
        </TabsContent>

      </Tabs>
    </div>
  );
}
