export interface KnotCategory {
  id: string;
  name: string;
  description: string;
}

export interface InstructionStep {
  stepNumber: number;
  instruction: string;
  image?: string;
}

export interface Knot {
  id: string;
  name: string;
  categoryId: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  uses: string[];
  description: string;
  strength: number;
  mainImage: string;
  instructions: InstructionStep[];
  tips?: string[];
}

export interface KnotData {
  categories: KnotCategory[];
  knots: Knot[];
}