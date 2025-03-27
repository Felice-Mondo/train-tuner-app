
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ArrowUpDown, 
  Filter, 
  Plus, 
  Search, 
  Trash, 
  Edit, 
  Copy,
  Info,
  X,
  Camera,
  Check,
  Dumbbell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

// Exercise type definition
interface Exercise {
  id: number;
  name: string;
  category: "strength" | "cardio" | "flexibility";
  muscles: string[];
  description: string;
  videoUrl?: string;
  notes?: string;
}

const mockExercises: Exercise[] = [
  {
    id: 1,
    name: "Bench Press",
    category: "strength",
    muscles: ["chest", "triceps", "shoulders"],
    description: "Lie on a flat bench, lower a barbell to your chest, then push it back up."
  },
  {
    id: 2,
    name: "Squat",
    category: "strength",
    muscles: ["quadriceps", "hamstrings", "glutes", "lower back"],
    description: "Stand with barbell on shoulders, lower your hips until thighs are parallel to the ground, then stand back up."
  },
  {
    id: 3,
    name: "Deadlift",
    category: "strength",
    muscles: ["lower back", "hamstrings", "glutes", "traps"],
    description: "Bend at the hips and knees to grip a barbell, then stand up straight while holding the weight."
  },
  {
    id: 4,
    name: "Pull-up",
    category: "strength",
    muscles: ["lats", "biceps", "shoulders"],
    description: "Hang from a bar with palms facing away, pull yourself up until your chin is over the bar."
  },
  {
    id: 5,
    name: "Running",
    category: "cardio",
    muscles: ["quadriceps", "hamstrings", "calves", "cardiovascular system"],
    description: "Run at a steady pace or intervals to improve cardiovascular fitness."
  },
  {
    id: 6,
    name: "Downward Dog",
    category: "flexibility",
    muscles: ["shoulders", "hamstrings", "calves", "lower back"],
    description: "From a plank position, push hips up and back to form an inverted V with your body."
  }
];

const ExerciseCard = ({ exercise, onEdit, onDelete, onDuplicate }: { 
  exercise: Exercise, 
  onEdit: (exercise: Exercise) => void,
  onDelete: (id: number) => void,
  onDuplicate: (exercise: Exercise) => void
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-lg overflow-hidden border-none shadow-soft hover:shadow-strong transition-all duration-300"
    >
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg leading-tight">{exercise.name}</h3>
            <Badge 
              variant="outline" 
              className={`mt-1 ${
                exercise.category === "strength" ? "bg-blue-500/10 text-blue-600" :
                exercise.category === "cardio" ? "bg-red-500/10 text-red-600" :
                "bg-green-500/10 text-green-600"
              }`}
            >
              {exercise.category.charAt(0).toUpperCase() + exercise.category.slice(1)}
            </Badge>
          </div>
          <div className="flex gap-1">
            <Button size="icon" variant="ghost" onClick={() => onEdit(exercise)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => onDuplicate(exercise)}>
              <Copy className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => onDelete(exercise.id)}>
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="mt-3">
          <div className="flex flex-wrap gap-1 mb-2">
            {exercise.muscles.map(muscle => (
              <span 
                key={muscle} 
                className="text-xs bg-muted px-2 py-0.5 rounded-full"
              >
                {muscle}
              </span>
            ))}
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2">
            {exercise.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const Exercises = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [exercises, setExercises] = useState(mockExercises);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();
  
  // Form fields
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState<"strength" | "cardio" | "flexibility">("strength");
  const [formMuscles, setFormMuscles] = useState<string[]>([]);
  const [formDescription, setFormDescription] = useState("");
  const [formNotes, setFormNotes] = useState("");
  
  const allMuscles = [
    "chest", "back", "shoulders", "biceps", "triceps", "forearms",
    "quadriceps", "hamstrings", "calves", "glutes", "abs", "lower back",
    "traps", "lats", "cardiovascular system"
  ];
  
  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          exercise.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          exercise.muscles.some(m => m.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || exercise.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  const resetForm = () => {
    setFormName("");
    setFormCategory("strength");
    setFormMuscles([]);
    setFormDescription("");
    setFormNotes("");
    setEditingExercise(null);
  };
  
  const handleOpenAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };
  
  const handleEdit = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setFormName(exercise.name);
    setFormCategory(exercise.category);
    setFormMuscles(exercise.muscles);
    setFormDescription(exercise.description);
    setFormNotes(exercise.notes || "");
    setIsAddDialogOpen(true);
  };
  
  const handleDelete = (id: number) => {
    setExercises(exercises.filter(exercise => exercise.id !== id));
    toast({
      title: "Exercise deleted",
      description: "The exercise has been removed from your library."
    });
  };
  
  const handleDuplicate = (exercise: Exercise) => {
    const newExercise = {
      ...exercise,
      id: Math.max(...exercises.map(e => e.id)) + 1,
      name: `${exercise.name} (Copy)`
    };
    
    setExercises([...exercises, newExercise]);
    toast({
      title: "Exercise duplicated",
      description: "A copy has been added to your library."
    });
  };
  
  const handleSaveExercise = () => {
    if (!formName.trim()) {
      toast({
        title: "Error",
        description: "Exercise name is required.",
        variant: "destructive"
      });
      return;
    }
    
    if (formMuscles.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one target muscle.",
        variant: "destructive"
      });
      return;
    }
    
    if (editingExercise) {
      // Update existing exercise
      const updatedExercises = exercises.map(exercise => 
        exercise.id === editingExercise.id ? {
          ...exercise,
          name: formName,
          category: formCategory,
          muscles: formMuscles,
          description: formDescription,
          notes: formNotes
        } : exercise
      );
      
      setExercises(updatedExercises);
      toast({
        title: "Exercise updated",
        description: "The exercise has been successfully updated."
      });
    } else {
      // Add new exercise
      const newExercise: Exercise = {
        id: Math.max(...exercises.map(e => e.id), 0) + 1,
        name: formName,
        category: formCategory,
        muscles: formMuscles,
        description: formDescription,
        notes: formNotes || undefined
      };
      
      setExercises([...exercises, newExercise]);
      toast({
        title: "Exercise added",
        description: "The exercise has been added to your library."
      });
    }
    
    setIsAddDialogOpen(false);
    resetForm();
  };
  
  const toggleMuscle = (muscle: string) => {
    setFormMuscles(prev => 
      prev.includes(muscle) 
        ? prev.filter(m => m !== muscle) 
        : [...prev, muscle]
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Exercises</h1>
          <p className="text-muted-foreground">Manage your exercise library</p>
        </div>
        <Button onClick={handleOpenAddDialog} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> New Exercise
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search exercises..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-[180px]">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <SelectValue placeholder="Filter by" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="strength">Strength</SelectItem>
            <SelectItem value="cardio">Cardio</SelectItem>
            <SelectItem value="flexibility">Flexibility</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4" /> Sort
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExercises.length > 0 ? (
          filteredExercises.map(exercise => (
            <ExerciseCard 
              key={exercise.id} 
              exercise={exercise} 
              onEdit={handleEdit}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
            />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12 px-4 bg-muted/30 rounded-lg text-center">
            <div className="bg-primary/10 rounded-full p-3 mb-4">
              <Dumbbell className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-1">No exercises found</h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              {searchTerm || selectedCategory !== "all" 
                ? "Try changing your search or filter criteria."
                : "Your exercise library is empty. Add your first exercise to get started."}
            </p>
            <Button onClick={handleOpenAddDialog}>Add Exercise</Button>
          </div>
        )}
      </div>

      {/* Add/Edit Exercise Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingExercise ? "Edit Exercise" : "Add New Exercise"}
            </DialogTitle>
            <DialogDescription>
              {editingExercise 
                ? "Update the details of this exercise in your library." 
                : "Create a new exercise to add to your library."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="exercise-name" className="mb-2 block">Exercise Name *</Label>
                <Input 
                  id="exercise-name" 
                  value={formName} 
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Bench Press, Squats, etc."
                />
              </div>
              
              <div>
                <Label className="mb-2 block">Category *</Label>
                <Tabs value={formCategory} onValueChange={(v) => setFormCategory(v as any)}>
                  <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="strength">Strength</TabsTrigger>
                    <TabsTrigger value="cardio">Cardio</TabsTrigger>
                    <TabsTrigger value="flexibility">Flexibility</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <div>
                <Label className="mb-2 block">Target Muscles *</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-muted/30 p-4 rounded-lg">
                  {allMuscles.map(muscle => (
                    <div key={muscle} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`muscle-${muscle}`} 
                        checked={formMuscles.includes(muscle)}
                        onCheckedChange={() => toggleMuscle(muscle)}
                      />
                      <Label htmlFor={`muscle-${muscle}`} className="capitalize">
                        {muscle}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <Label htmlFor="exercise-description" className="mb-2 block">Description</Label>
                <Textarea 
                  id="exercise-description" 
                  value={formDescription} 
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Describe how to perform this exercise correctly..."
                  rows={4}
                />
              </div>
              
              <div>
                <Label className="flex items-center gap-2 mb-2 block">
                  Video Instructions <span className="text-muted-foreground text-xs">(Coming soon)</span>
                </Label>
                <div className="bg-muted/30 rounded-lg flex flex-col items-center justify-center py-8 px-4 border border-dashed border-muted cursor-not-allowed opacity-70">
                  <Camera className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground text-center">
                    Upload a video demonstration of this exercise
                  </p>
                </div>
              </div>
              
              <div>
                <Label htmlFor="exercise-notes" className="mb-2 block">Personal Notes</Label>
                <Textarea 
                  id="exercise-notes" 
                  value={formNotes} 
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Add any personal notes about this exercise..."
                  rows={2}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveExercise}>
              {editingExercise ? "Save Changes" : "Add Exercise"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Exercises;
