import { db } from "./db";
import {
  teams,
  evaluations,
  type Team,
  type InsertTeam,
  type Evaluation,
  type InsertEvaluation,
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getTeams(): Promise<Team[]>;
  getTeam(id: number): Promise<Team | undefined>;
  createTeam(team: InsertTeam): Promise<Team>;
  getEvaluations(): Promise<Evaluation[]>;
  createEvaluation(evaluation: InsertEvaluation): Promise<Evaluation>;
}

export class DatabaseStorage implements IStorage {
  async getTeams(): Promise<Team[]> {
    return await db.select().from(teams).orderBy(desc(teams.createdAt));
  }

  async getTeam(id: number): Promise<Team | undefined> {
    const [team] = await db.select().from(teams).where(eq(teams.id, id));
    return team;
  }

  async createTeam(insertTeam: InsertTeam): Promise<Team> {
    // Generate a mock git score between 5 and 20 for demo purposes
    const gitScore = Math.floor(Math.random() * 16) + 5;
    const [team] = await db.insert(teams).values({ ...insertTeam, gitScore }).returning();
    return team;
  }

  async getEvaluations(): Promise<Evaluation[]> {
    return await db.select().from(evaluations);
  }

  async createEvaluation(insertEvaluation: InsertEvaluation): Promise<Evaluation> {
    const totalScore = 
      insertEvaluation.innovation + 
      insertEvaluation.techComplexity + 
      insertEvaluation.uiUx + 
      insertEvaluation.practicalImpact + 
      insertEvaluation.presentation;

    const [evaluation] = await db.insert(evaluations).values({ ...insertEvaluation, totalScore }).returning();
    return evaluation;
  }
}

export class MemStorage implements IStorage {
  private teams: Map<number, Team>;
  private evaluations: Map<number, Evaluation>;
  private currentTeamId: number;
  private currentEvaluationId: number;

  constructor() {
    this.teams = new Map();
    this.evaluations = new Map();
    this.currentTeamId = 1;
    this.currentEvaluationId = 1;
  }

  async getTeams(): Promise<Team[]> {
    return Array.from(this.teams.values()).sort((a, b) => 
      (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0)
    );
  }

  async getTeam(id: number): Promise<Team | undefined> {
    return this.teams.get(id);
  }

  async createTeam(insertTeam: InsertTeam): Promise<Team> {
    const id = this.currentTeamId++;
    const gitScore = Math.floor(Math.random() * 16) + 5;
    const team: Team = { 
      ...insertTeam, 
      id, 
      gitScore, 
      createdAt: new Date() 
    };
    this.teams.set(id, team);
    return team;
  }

  async getEvaluations(): Promise<Evaluation[]> {
    return Array.from(this.evaluations.values());
  }

  async createEvaluation(insertEvaluation: InsertEvaluation): Promise<Evaluation> {
    const id = this.currentEvaluationId++;
    const totalScore = 
      insertEvaluation.innovation + 
      insertEvaluation.techComplexity + 
      insertEvaluation.uiUx + 
      insertEvaluation.practicalImpact + 
      insertEvaluation.presentation;

    const evaluation: Evaluation = { 
      ...insertEvaluation, 
      id, 
      totalScore, 
      createdAt: new Date() 
    };
    this.evaluations.set(id, evaluation);
    return evaluation;
  }
}

export const storage = process.env.DATABASE_URL 
  ? new DatabaseStorage() 
  : new MemStorage();
