"use server";
import { supabase } from "../../../lib/supabaseClient";

export async function uploadImage(file: File): Promise<string> {
    const fileName = `${Date.now()}_${file.name}`; // สร้างชื่อไฟล์แบบไม่ซ้ำ
    const { data, error } = await supabase.storage
        .from("Marong")
        .upload(fileName, file);

    if (error) {      
        throw error;
    }

    const { data: publicURLData } = supabase.storage
        .from("Marong")
        .getPublicUrl(fileName);

    if (!publicURLData) {
        throw new Error("Failed to retrieve public URL");
    }

    return publicURLData.publicUrl;
}
