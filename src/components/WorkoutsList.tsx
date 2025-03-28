
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { CalendarIcon, Clock, Trash2, Loader2 } from "lucide-react";
import { useWorkouts, Workout } from "@/contexts/WorkoutsContext";
import { Card } from "@/components/ui/card";

const WorkoutsList = () => {
  const { workouts, loading, error, deleteWorkout } = useWorkouts();
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const handleDeleteWorkout = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteWorkout(id);
    } catch (error) {
      console.error("Error deleting workout:", error);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        <p>Error loading workouts</p>
        <p className="text-sm">{error.message}</p>
      </div>
    );
  }

  if (workouts.length === 0) {
    return (
      <Card className="text-center py-10 px-4">
        <p className="text-muted-foreground mb-2">You don't have any workouts yet.</p>
        <p>Create your first workout to start tracking your fitness journey.</p>
      </Card>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="hidden sm:table-cell">Date</TableHead>
            <TableHead className="hidden md:table-cell">Duration</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workouts.map((workout) => (
            <TableRow key={workout.id}>
              <TableCell className="font-medium">
                <div>
                  <p>{workout.name}</p>
                  {workout.description && (
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {workout.description}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span>{format(new Date(workout.date), "PP")}</span>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {workout.duration ? (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{workout.duration} mins</span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">Not set</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500">
                      <span className="sr-only">Delete</span>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Workout</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{workout.name}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteWorkout(workout.id)}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        {deletingId === workout.id ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : null}
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default WorkoutsList;
