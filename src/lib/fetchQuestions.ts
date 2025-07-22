import { supabase } from "./supabaseClient";

export default async function fetchQuestions(limit = 10) {
  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .order("id", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("Failed to fetch questions:", error.message);
    return [];
  }

  return data;
}
