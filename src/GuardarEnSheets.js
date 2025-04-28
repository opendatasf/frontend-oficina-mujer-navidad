const GuardarEnSheets = async (datosFormulario) => {
  const url = import.meta.env.VITE_BACKEND_APPSCRIPT
  console.log("URL DE CALL",url);

  console.log(JSON.stringify(datosFormulario));

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" }, // 🔥 ya NO usamos 'no-cors'
      body: JSON.stringify(datosFormulario),
    });

    if (!response.ok) throw new Error("❌ Error en la subida");

    console.log("✅ Datos enviados correctamente a Google Sheets");
  } catch (error) {
    console.error("❌ Error al enviar los datos:", error);
  }
};

export default GuardarEnSheets;
