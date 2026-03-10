import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Seed initial data if empty
  seedDatabase().catch(console.error);

  app.get(api.teams.list.path, async (_req, res) => {
    const teams = await storage.getTeams();
    res.json(teams);
  });

  app.get(api.teams.get.path, async (req, res) => {
    const team = await storage.getTeam(Number(req.params.id));
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }
    res.json(team);
  });

  app.post(api.teams.create.path, async (req, res) => {
    try {
      const input = api.teams.create.input.parse(req.body);
      const team = await storage.createTeam(input);
      res.status(201).json(team);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join("."),
        });
      }
      throw err;
    }
  });

  app.get(api.evaluations.list.path, async (_req, res) => {
    const evals = await storage.getEvaluations();
    res.json(evals);
  });

  app.post(api.evaluations.create.path, async (req, res) => {
    try {
      const input = api.evaluations.create.input.extend({
        teamId: z.coerce.number(),
        innovation: z.coerce.number(),
        techComplexity: z.coerce.number(),
        uiUx: z.coerce.number(),
        practicalImpact: z.coerce.number(),
        presentation: z.coerce.number(),
      }).parse(req.body);
      
      const evaluation = await storage.createEvaluation(input);
      res.status(201).json(evaluation);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join("."),
        });
      }
      throw err;
    }
  });

  // Mock Authentication for Judges
  app.post(api.auth.login.path, async (req, res) => {
    try {
      // Parse and validate the request body
      const input = api.auth.login.input.parse(req.body);
      const { username, password } = input;
      
      // Mock login: accept any username and password combination
      if (username && username.trim() && password && password.trim()) {
        if (req.session) {
          req.session.judgeId = username;
        }
        return res.status(200).json({ message: "Logged in successfully", judgeId: username });
      }
      
      res.status(401).json({ message: "Invalid credentials" });
    } catch (err) {
      console.error("Login error:", err);
      res.status(400).json({ message: "Bad request" });
    }
  });

  app.post(api.auth.logout.path, async (req, res) => {
    req.session.destroy(() => {
      res.status(200).json({ message: "Logged out successfully" });
    });
  });

  return httpServer;
}

// Add types for session
declare module "express-session" {
  interface SessionData {
    judgeId?: string;
  }
}

async function seedDatabase() {
  const existingTeams = await storage.getTeams();
  if (existingTeams.length === 0) {
    await storage.createTeam({
      name: "Team Alpha",
      domain: "Agentic AI",
      problemStatement: "PS-1: Autonomous Dev Agents",
      lab: "Lab A",
      githubRepo: "https://github.com/team-alpha/techblitz",
      figmaLink: "",
      members: ["Alice", "Bob", "Charlie"],
    });

    await storage.createTeam({
      name: "Team Nova",
      domain: "Vibeathon",
      problemStatement: "PS-2: Interactive Web Experiences",
      lab: "Lab B",
      githubRepo: "https://github.com/team-nova/vibe",
      figmaLink: "https://figma.com/file/nova",
      members: ["Dave", "Eve"],
    });

    await storage.createTeam({
      name: "Team Cipher",
      domain: "UI/UX Challenge",
      problemStatement: "PS-3: NextGen Dashboard",
      lab: "Lab D",
      githubRepo: "https://github.com/team-cipher/ui",
      figmaLink: "https://figma.com/file/cipher",
      members: ["Frank", "Grace", "Heidi"],
    });
  }
}
