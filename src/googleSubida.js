export async function subirPDFaDrive(finalBlob, nombreArchivo, folderId) {
    try {
      const formData = new FormData();
        const originalName = nombreArchivo.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Quita tildes

      formData.append("file", finalBlob, originalName);
      console.log(nombreArchivo)
      formData.append("folderId", folderId);
    
      const response = await fetch(import.meta.env.VITE_UPLOADER_MCCD, {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) throw new Error("❌ Error al subir archivo");
  
      const { fileId, fileUrl } = await response.json();
      console.log("✅ Archivo subido a Drive:", fileUrl);
  
      return fileUrl;
    } catch (error) {
      console.error("❌ Error en la subida:", error);
      throw error;
    }
  }
  