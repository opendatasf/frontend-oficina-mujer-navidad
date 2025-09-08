// src/Formulario.jsx
import React, { useState } from 'react';
import GuardarEnSheets from './GuardarEnSheets';
import Swal from 'sweetalert2';

const BENEFICIARIO_VACIO = {
  nombreFuncionario: '',
  apellidoFuncionario: '',
  apellido2Funcionario: '',
  cargo: '',
  nombreHijo: '',
  sexo: '',
  edad: '',
};

export default function Formulario() {
  const [general, setGeneral] = useState({ direccion: '' });
  const [beneficiarios, setBeneficiarios] = useState([{ ...BENEFICIARIO_VACIO }]);
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);

  const onChangeGeneral = (e) => {
    const { name, value } = e.target;
    setGeneral((g) => ({ ...g, [name]: value }));
  };

  const onChangeBenef = (idx, e) => {
    const { name, value } = e.target;
    setBeneficiarios((prev) =>
      prev.map((b, i) => (i === idx ? { ...b, [name]: value } : b))
    );
  };

  const agregarBeneficiario = () => {
    setBeneficiarios((prev) => [...prev, { ...BENEFICIARIO_VACIO }]);
  };

  const eliminarBeneficiario = async (idx) => {
    const b = beneficiarios[idx];
    const nombreMostrado = [b?.nombreFuncionario, b?.apellidoFuncionario, b?.apellido2Funcionario]
      .filter(Boolean)
      .join(' ')
      .trim() || `Beneficiario #${idx + 1}`;

    const { isConfirmed } = await Swal.fire({
      icon: 'warning',
      title: '¿Eliminar beneficiario?',
      html: `Se eliminará <b>${nombreMostrado}</b>.`,
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
    });
    if (!isConfirmed) return;

    setBeneficiarios((prev) => {
      if (prev.length === 1) return [{ ...BENEFICIARIO_VACIO }];
      return prev.filter((_, i) => i !== idx);
    });

    await Swal.fire({
      icon: 'success',
      title: 'Eliminado',
      timer: 1200,
      showConfirmButton: false,
    });
  };

  const validar = () => {
    if (!general.direccion.trim()) return 'La dirección es obligatoria.';
    if (beneficiarios.length === 0) return 'Agrega al menos un beneficiario.';
    for (let i = 0; i < beneficiarios.length; i++) {
      const b = beneficiarios[i];
      if (!b.nombreFuncionario.trim())
        return `Beneficiario #${i + 1}: falta el nombre del funcionario.`;
      if (!b.apellidoFuncionario.trim())
        return `Beneficiario #${i + 1}: falta el primer apellido del funcionario.`;
      if (!b.apellido2Funcionario.trim())
        return `Beneficiario #${i + 1}: falta el segundo apellido del funcionario.`;
      if (!b.nombreHijo.trim())
        return `Beneficiario #${i + 1}: falta el nombre del hijo/a.`;
      if (!String(b.sexo).trim())
        return `Beneficiario #${i + 1}: falta el sexo del hijo/a.`;
      if (!String(b.edad).trim())
        return `Beneficiario #${i + 1}: falta la edad.`;
      const edadNum = Number(b.edad);
      if (!Number.isFinite(edadNum) || edadNum < 0)
        return `Beneficiario #${i + 1}: la edad no es válida.`;
    }
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMensaje(null);
    setError(null);

    const err = validar();
    if (err) {
      Swal.fire({ icon: 'warning', title: 'Validación incompleta', text: err });
      return;
    }

    const payload = {
      general: { direccion: general.direccion },
      beneficiarios: beneficiarios.map((b) => ({
        nombreFuncionario: b.nombreFuncionario,
        apellidoFuncionario: b.apellidoFuncionario,
        apellido2Funcionario: b.apellido2Funcionario,
        nombreHijo: b.nombreHijo,
        sexo: b.sexo,
        edad: Number(b.edad),
      })),
    };

    try {
      setEnviando(true);
      const res = await GuardarEnSheets(payload);
      Swal.fire({
        icon: 'success',
        title: '¡Enviado!',
        text: res.message || 'Los datos fueron guardados con éxito en Sheets.',
      });
    } catch (e2) {
      console.error(e2);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: e2.message || 'Ocurrió un error al enviar los datos.',
      });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column', // sticky footer
        backgroundImage: 'url("/image2.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* CONTENIDO PRINCIPAL */}
      <main style={{ flex: 1, padding: '24px 16px' }}>
        {/* Tarjeta unificada: Cinta + Hero + Datos del Responsable */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <section
            style={{
              width: 'min(1080px, 100%)',
              borderRadius: 14,
              overflow: 'hidden',
              boxShadow: '0 10px 26px rgba(0,0,0,0.18)',
              background: 'rgba(255,255,255,0.92)',
            }}
          >
            {/* Cinta */}
            <div
              style={{
                background: 'linear-gradient(90deg, #d32f2f, #e53935)',
                color: '#fff',
                padding: '12px 20px',
                fontWeight: 800,
                fontSize: 20,
                textAlign: 'center',
                letterSpacing: 0.2,
              }}
            >
              <span aria-hidden="true">🎄</span> Programa de Navidad{' '}
              <span aria-hidden="true">🎄</span>
            </div>

            {/* Hero */}
            {/* Hero con overlay + texto encima + logo derecha */}
            <div
            style={{
                position: 'relative',
                height: 180,
                backgroundImage: 'url("/navidad.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'brightness(0.7)', // oscurece la imagen de fondo
            }}
            >
            {/* Texto centrado */}
            <div
                style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: 'white',
                textAlign: 'center',
                fontWeight: 800,
                textShadow: '0 2px 6px rgba(0,0,0,0.6)',
                }}
            >
                <div style={{ fontSize: 28, marginBottom: 6 }}>¡Celebremos juntos la Navidad!</div>
                <div style={{ fontSize: 16 }}>
                Registro de hijos de funcionarios y actividades especiales
                </div>
            </div>

            {/* Logo en la esquina derecha */}
            <img
                src="/sflogosvg.png"
                alt="Logo Municipalidad de San Fernando"
                style={{
                position: 'absolute',
                top: '30%',
                right: 20,
                transform: 'translateY(-50%)',
                height: 80,
                opacity: 0.9,
                }}
            />
            </div>



            {/* Datos del Responsable */}
            <div style={{ padding: 18 }}>
              <div
                style={{
                  fontWeight: 800,
                  color: '#374151',
                  marginBottom: 10,
                  fontSize: 18,
                }}
              >
                Datos del Generales
              </div>

              <div style={{ marginBottom: 10 }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>
                  Dirección / Departamento / Área
                </label>
                <select
                  name="direccion"
                  value={general.direccion}
                  onChange={onChangeGeneral}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 10,
                    border: '1px solid #e5e7eb',
                    outline: 'none',
                    boxShadow: '0 1px 0 rgba(0,0,0,0.02) inset',
                    backgroundColor: 'white',
                  }}
                >
                  <option value="">Seleccione una opción…</option>
                  <option value="DAJ">Dirección de Asesoría Jurídica</option>
                  <option value="DAF">Dirección de Administración y Finanzas</option>
                  <option value="SECPLAN">Secretaría Comunal de Planificación</option>
                  <option value="UGRD">Unidad de Gestión de Riesgos y Desastres</option>
                  <option value="JPL">Juzgado de Policía Local</option>
                  <option value="SP">Dirección de Seguridad Pública</option>
                  <option value="SSGG">Dirección de Servicios Generales</option>
                  <option value="DIDECO">Dirección de Desarrollo Comunitario</option>
                  <option value="TRANSITO">Dirección de Tránsito y Transportes</option>
                  <option value="DOM">Dirección de Obras Municipales</option>
                  <option value="CONTRALORIA">Dirección de Control Interno</option>
                  <option value="RRHH">Dirección de Recursos Humanos</option>
                  <option value="ADM">Administración Municipal</option>
                  <option value="SECMUN">Secretaría Municipal</option>
                  <option value="ALC">Alcaldía</option>
                </select>
              </div>
            </div>
          </section>
        </div>

        {/* Contenedor central para Beneficiarios y botón Enviar */}
        <div style={{ width: 'min(1080px, 100%)', margin: '0 auto' }}>
          {/* Tarjeta: Hijos/Beneficiarios */}
          <section
            style={{
              background: 'rgba(255,255,255,0.92)',
              borderRadius: 12,
              boxShadow: '0 10px 26px rgba(0,0,0,0.18)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                background: 'linear-gradient(90deg,#c62828,#d32f2f)',
                color: '#fff',
                padding: '14px 18px',
                fontWeight: 800,
                fontSize: 16,
                letterSpacing: 0.3,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <span style={{ fontSize: 18 }}>🎁</span>
              Registro de Hijos de Funcionarios
            </div>

            <div style={{ padding: 18 }}>
              {/* Encabezados tipo tabla */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.1fr 1fr 1fr 1fr 120px 150px 90px',
                  gap: 10,
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#374151',
                  padding: '10px 12px',
                  background: '#faf7f7',
                  border: '1px dashed #e5e7eb',
                  borderRadius: 10,
                  marginBottom: 10,
                }}
              >
                <div>Nombre funcionario</div>
                <div>Primer apellido</div>
                <div>Segundo apellido</div>
                <div>Cargo</div>
                <div>Nombre completo hijo/a</div>
                <div>Edad</div>
                <div>Sexo del hijo/a</div>
                <div style={{ textAlign: 'center' }}>Acción</div>
              </div>

              {/* Filas */}
              {beneficiarios.map((b, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1.1fr 1fr 1fr 1fr 120px 150px 90px',
                    gap: 10,
                    padding: '10px 12px',
                    alignItems: 'center',
                    border: '1px solid #f1f1f1',
                    borderRadius: 10,
                    background: '#fff',
                    marginBottom: 10,
                  }}
                >
                  <input
                    type="text"
                    name="nombreFuncionario"
                    value={b.nombreFuncionario}
                    onChange={(e) => onChangeBenef(idx, e)}
                    placeholder="Ej: Juan"
                    style={inputStyle}
                  />
                  <input
                    type="text"
                    name="apellidoFuncionario"
                    value={b.apellidoFuncionario}
                    onChange={(e) => onChangeBenef(idx, e)}
                    placeholder="Ej: Pérez"
                    style={inputStyle}
                  />
                  <input
                    type="text"
                    name="apellido2Funcionario"
                    value={b.apellido2Funcionario}
                    onChange={(e) => onChangeBenef(idx, e)}
                    placeholder="Ej: Cortés"
                    style={inputStyle}
                  />
                  <input
                    type="text"
                    name="cargo"
                    value={b.cargo}
                    onChange={(e) => onChangeBenef(idx, e)}
                    placeholder="Ej: Encargado de Inframenor"
                    style={inputStyle}
                  />
                  <input
                    type="text"
                    name="nombreHijo"
                    value={b.nombreHijo}
                    onChange={(e) => onChangeBenef(idx, e)}
                    placeholder="Ej: Ana Ramires Nuñez"
                    style={inputStyle}
                  />
                  <input
                    type="number"
                    name="edad"
                    value={b.edad}
                    onChange={(e) => onChangeBenef(idx, e)}
                    min="0"
                    placeholder="Ej: 7"
                    style={inputStyle}
                  />
                  <select
                    name="sexo"
                    value={b.sexo}
                    onChange={(e) => onChangeBenef(idx, e)}
                    style={inputStyle}
                  >
                    <option value="">Selecciona…</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Otro">Otro</option>
                  </select>

                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button type="button" onClick={() => eliminarBeneficiario(idx)} style={btnDanger}>
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}

              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" onClick={agregarBeneficiario} style={btnGhost}>
                  + Agregar hijo
                </button>
              </div>
            </div>
          </section>

          {/* Mensajes + Enviar */}
          <form onSubmit={onSubmit} style={{ display: 'grid', gap: 10, marginTop: 12 }}>
            {error && (
              <div style={{ color: '#b00020', background: '#fee2e2', padding: 10, borderRadius: 8 }}>
                {error}
              </div>
            )}
            {mensaje && (
              <div style={{ color: '#065f46', background: '#d1fae5', padding: 10, borderRadius: 8 }}>
                {mensaje}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <button
                type="submit"
                disabled={enviando}
                style={{
                  background: enviando ? '#bbb' : 'linear-gradient(90deg,#7c3aed,#6d28d9)',
                  color: 'white',
                  padding: '10px 16px',
                  borderRadius: 10,
                  fontWeight: 700,
                  boxShadow: '0 8px 18px rgba(78, 28, 148, 0.25)',
                  border: 'none',
                  cursor: enviando ? 'not-allowed' : 'pointer',
                }}
              >
                {enviando ? 'Enviando…' : 'Guardar / Enviar'}
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* FOOTER (siempre al fondo) */}
      <footer
        style={{
          backgroundColor: '#0a3d4d',
          color: 'white',
          textAlign: 'center',
          padding: '16px 8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <img src="/informatica.svg" alt="Departamento de Informática" style={{ height: 40 }} />
          <span style={{ fontSize: 14 }}>
            © 2025 Departamento de Informática, Todos los Derechos Reservados | Mesa de Ayuda:
            <strong> 722976090 </strong> Anexo: <strong>6114 / 6109</strong>
          </span>
        </div>
      </footer>
    </div>
  );
}

/* —— Estilos reutilizables —— */
const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 10,
  border: '1px solid #e5e7eb',
  outline: 'none',
  boxShadow: '0 1px 0 rgba(0,0,0,0.02) inset',
};

const btnDanger = {
  background: '#fee2e2',
  color: '#991b1b',
  padding: '8px 12px',
  borderRadius: 10,
  fontWeight: 700,
  border: '1px solid #fecaca',
  cursor: 'pointer',
};

const btnGhost = {
  background: '#fff5f5',
  color: '#7a1f1f',
  padding: '10px 12px',
  borderRadius: 10,
  fontWeight: 700,
  border: '1px dashed #fca5a5',
  cursor: 'pointer',
};
