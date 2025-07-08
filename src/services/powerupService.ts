type PowerUp = {
  id: number;
  name: string;
  description: string;
  used: boolean;
};

export async function getPowerUps(): Promise<PowerUp[]> {
  try {
    // Replace with Supabase call when available
    throw new Error("Power-ups table not implemented yet");
  } catch {
    return fallbackPowerUps();
  }
}

function fallbackPowerUps(): PowerUp[] {
  return [
    { id: 1, name: 'Skip', description: 'Skip this question.', used: false },
    { id: 2, name: '50/50', description: 'Remove two wrong answers.', used: false },
  ];
}
