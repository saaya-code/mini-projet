import User from "@/models/User"
import Professor from "@/models/Professor"
import Student from "@/models/Student"
import Room from "@/models/Room"
import Project from "@/models/Project"
import Defense from "@/models/Defense"
import Notification from "@/models/Notification"

// Export models to ensure they're registered
export { User, Professor, Student, Room, Project, Defense, Notification }

// Helper function to preload all models
export function preloadModels() {
  // Just accessing the models ensures they're registered
  return { User, Professor, Student, Room, Project, Defense, Notification }
}
