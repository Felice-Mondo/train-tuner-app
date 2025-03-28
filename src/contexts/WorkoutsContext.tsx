
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface Workout {
  id: string;
  name: string;
  description: string | null;
  date: string;
  duration: number | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface WorkoutInput {
  name: string;
  description?: string;
  date: Date;
  duration?: number;
}

interface WorkoutsContextType {
  workouts: Workout[];
  loading: boolean;
  error: Error | null;
  createWorkout: (workout: WorkoutInput) => Promise<Workout | null>;
  updateWorkout: (id: string, workout: Partial<WorkoutInput>) => Promise<Workout | null>;
  deleteWorkout: (id: string) => Promise<boolean>;
  refreshWorkouts: () => Promise<void>;
}

const WorkoutsContext = createContext<WorkoutsContextType | undefined>(undefined);

export const WorkoutsProvider = ({ children }: { children: ReactNode }) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch workouts when user changes
  useEffect(() => {
    if (user) {
      fetchWorkouts();
    } else {
      setWorkouts([]);
      setLoading(false);
    }
  }, [user]);

  // Fetch workouts from Supabase
  const fetchWorkouts = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("workouts")
        .select("*")
        .order("date", { ascending: false });

      if (error) {
        throw error;
      }

      setWorkouts(data || []);
    } catch (err: any) {
      setError(err);
      toast({
        title: "Error",
        description: "Failed to fetch workouts",
        variant: "destructive",
      });
      console.error("Error fetching workouts:", err);
    } finally {
      setLoading(false);
    }
  };

  // Create a new workout
  const createWorkout = async (workout: WorkoutInput): Promise<Workout | null> => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create workouts",
        variant: "destructive",
      });
      return null;
    }

    try {
      setLoading(true);
      
      const newWorkout = {
        ...workout,
        date: workout.date.toISOString(),
        user_id: user.id
      };

      const { data, error } = await supabase
        .from("workouts")
        .insert([newWorkout])
        .select()
        .single();

      if (error) {
        throw error;
      }

      setWorkouts(prevWorkouts => [data, ...prevWorkouts]);
      
      toast({
        title: "Success",
        description: "Workout created successfully",
      });
      
      return data;
    } catch (err: any) {
      setError(err);
      toast({
        title: "Error",
        description: "Failed to create workout",
        variant: "destructive",
      });
      console.error("Error creating workout:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing workout
  const updateWorkout = async (id: string, workout: Partial<WorkoutInput>): Promise<Workout | null> => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to update workouts",
        variant: "destructive",
      });
      return null;
    }

    try {
      setLoading(true);
      
      const updates: any = { ...workout };
      
      // Convert date to ISO string if present
      if (workout.date) {
        updates.date = workout.date.toISOString();
      }

      const { data, error } = await supabase
        .from("workouts")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setWorkouts(prevWorkouts => 
        prevWorkouts.map(w => w.id === id ? data : w)
      );
      
      toast({
        title: "Success",
        description: "Workout updated successfully",
      });
      
      return data;
    } catch (err: any) {
      setError(err);
      toast({
        title: "Error",
        description: "Failed to update workout",
        variant: "destructive",
      });
      console.error("Error updating workout:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete a workout
  const deleteWorkout = async (id: string): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to delete workouts",
        variant: "destructive",
      });
      return false;
    }

    try {
      setLoading(true);

      const { error } = await supabase
        .from("workouts")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      setWorkouts(prevWorkouts => 
        prevWorkouts.filter(w => w.id !== id)
      );
      
      toast({
        title: "Success",
        description: "Workout deleted successfully",
      });
      
      return true;
    } catch (err: any) {
      setError(err);
      toast({
        title: "Error",
        description: "Failed to delete workout",
        variant: "destructive",
      });
      console.error("Error deleting workout:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Refresh workouts
  const refreshWorkouts = async (): Promise<void> => {
    await fetchWorkouts();
  };

  return (
    <WorkoutsContext.Provider
      value={{
        workouts,
        loading,
        error,
        createWorkout,
        updateWorkout,
        deleteWorkout,
        refreshWorkouts
      }}
    >
      {children}
    </WorkoutsContext.Provider>
  );
};

export const useWorkouts = () => {
  const context = useContext(WorkoutsContext);
  if (context === undefined) {
    throw new Error("useWorkouts must be used within a WorkoutsProvider");
  }
  return context;
};
