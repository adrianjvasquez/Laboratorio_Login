import { useEffect, useRef, useState } from 'react'

// Simulador ILUSTRATIVO. No ataca nada: anima en pantalla el "intento"
// de cada técnica contra un objetivo ficticio definido en data.js,
// para que se vea el funcionamiento interno de forma didáctica.

const VELOCIDAD = 320 // ms entre "intentos" animados

export default function Simulador({ ataque }) {
  switch (ataque.id) {
    case 'fuerza-bruta':
      return <SimFuerzaBruta ataque={ataque} />
    case 'diccionario':
      return <SimDiccionario ataque={ataque} />
    case 'credential-stuffing':
      return <SimCredential ataque={ataque} />
    case 'password-spraying':
      return <SimSpraying ataque={ataque} />
    case 'rainbow-table':
      return <SimRainbow ataque={ataque} />
    default:
      return null
  }
}

function useIntervalo(fn, activo, delay) {
  const ref = useRef(fn)
  ref.current = fn
  useEffect(() => {
    if (!activo) return
    const id = setInterval(() => ref.current(), delay)
    return () => clearInterval(id)
  }, [activo, delay])
}

function Controles({ corriendo, onToggle, onReset, estado }) {
  return (
    <div className="sim-controles">
      <button className="btn-sim" onClick={onToggle}>
        {corriendo ? '⏸ Pausar' : '▶ Simular'}
      </button>
      <button className="btn-sim secundario" onClick={onReset}>
        ↻ Reiniciar
      </button>
      {estado && <span className={`estado estado-${estado.tipo}`}>{estado.texto}</span>}
    </div>
  )
}

/* ---------- 1. Fuerza bruta: recorre PINs numéricos ---------- */
function SimFuerzaBruta({ ataque }) {
  const total = Math.pow(10, ataque.objetivoDemo.length)
  const [n, setN] = useState(0)
  const [corriendo, setCorriendo] = useState(false)
  const objetivo = parseInt(ataque.objetivoDemo, 10)
  const acertado = n === objetivo

  useIntervalo(
    () => {
      setN((prev) => {
        if (prev >= objetivo) {
          setCorriendo(false)
          return prev
        }
        // avanzamos a saltos para no tardar eternidades en la demo
        return Math.min(prev + Math.ceil(objetivo / 40), objetivo)
      })
    },
    corriendo && !acertado,
    VELOCIDAD / 3,
  )

  const intento = String(n).padStart(ataque.objetivoDemo.length, '0')
  return (
    <div className="sim">
      <p className="sim-desc">
        Objetivo: PIN de {ataque.objetivoDemo.length} dígitos. El atacante recorre el espacio de{' '}
        <b>{total.toLocaleString('es')}</b> combinaciones posibles.
      </p>
      <div className="pantalla">
        <span className="etiqueta">Probando</span>
        <span className={`valor ${acertado ? 'ok' : ''}`}>{intento}</span>
      </div>
      <Barra valor={n} max={objetivo} />
      <Controles
        corriendo={corriendo}
        onToggle={() => setCorriendo((c) => !c)}
        onReset={() => {
          setCorriendo(false)
          setN(0)
        }}
        estado={
          acertado ? { tipo: 'exito', texto: `✓ Clave encontrada: ${ataque.objetivoDemo}` } : null
        }
      />
    </div>
  )
}

/* ---------- 2. Diccionario: recorre una lista de palabras ---------- */
function SimDiccionario({ ataque }) {
  const [i, setI] = useState(-1)
  const [corriendo, setCorriendo] = useState(false)
  const idxObjetivo = ataque.diccionarioDemo.indexOf(ataque.objetivoDemo)
  const acertado = i === idxObjetivo

  useIntervalo(
    () => setI((prev) => {
      if (prev >= idxObjetivo) { setCorriendo(false); return prev }
      return prev + 1
    }),
    corriendo && !acertado,
    VELOCIDAD,
  )

  return (
    <div className="sim">
      <p className="sim-desc">El atacante prueba, en orden, una lista de contraseñas comunes conocidas.</p>
      <ul className="lista-intentos">
        {ataque.diccionarioDemo.map((palabra, idx) => (
          <li
            key={palabra}
            className={
              idx === i ? (idx === idxObjetivo ? 'activo ok' : 'activo fallo') : idx < i ? 'descartado' : ''
            }
          >
            <code>{palabra}</code>
            {idx === i && (idx === idxObjetivo ? ' ✓ acierto' : ' ✗ inválida')}
            {idx < i && ' ✗'}
          </li>
        ))}
      </ul>
      <Controles
        corriendo={corriendo}
        onToggle={() => setCorriendo((c) => !c)}
        onReset={() => { setCorriendo(false); setI(-1) }}
        estado={acertado ? { tipo: 'exito', texto: `✓ Coincidencia: "${ataque.objetivoDemo}"` } : null}
      />
    </div>
  )
}

/* ---------- 3. Credential stuffing: pares robados de otro sitio ---------- */
function SimCredential({ ataque }) {
  const [i, setI] = useState(-1)
  const [corriendo, setCorriendo] = useState(false)
  const idxObjetivo = ataque.listaDemo.findIndex(
    (c) => c.usuario === ataque.objetivoDemo.usuario && c.clave === ataque.objetivoDemo.clave,
  )
  const acertado = i === idxObjetivo

  useIntervalo(
    () => setI((prev) => {
      if (prev >= idxObjetivo) { setCorriendo(false); return prev }
      return prev + 1
    }),
    corriendo && !acertado,
    VELOCIDAD,
  )

  return (
    <div className="sim">
      <p className="sim-desc">
        El atacante prueba pares usuario:clave <b>filtrados de otra brecha</b>. Si la víctima reutilizó su
        contraseña, uno coincidirá.
      </p>
      <ul className="lista-intentos">
        {ataque.listaDemo.map((cred, idx) => (
          <li
            key={cred.usuario}
            className={
              idx === i ? (idx === idxObjetivo ? 'activo ok' : 'activo fallo') : idx < i ? 'descartado' : ''
            }
          >
            <code>{cred.usuario} : {cred.clave}</code>
            {idx === i && (idx === idxObjetivo ? ' ✓ reutilizada aquí' : ' ✗ no coincide')}
          </li>
        ))}
      </ul>
      <Controles
        corriendo={corriendo}
        onToggle={() => setCorriendo((c) => !c)}
        onReset={() => { setCorriendo(false); setI(-1) }}
        estado={acertado ? { tipo: 'exito', texto: `✓ Acceso con credenciales reutilizadas` } : null}
      />
    </div>
  )
}

/* ---------- 4. Password spraying: una clave contra muchos usuarios ---------- */
function SimSpraying({ ataque }) {
  const [i, setI] = useState(-1)
  const [corriendo, setCorriendo] = useState(false)
  // en la demo, 1 usuario "cae" con la clave rociada
  const idxVulnerable = 3
  const terminado = i >= ataque.usuariosDemo.length - 1

  useIntervalo(
    () => setI((prev) => {
      if (prev >= ataque.usuariosDemo.length - 1) { setCorriendo(false); return prev }
      return prev + 1
    }),
    corriendo && !terminado,
    VELOCIDAD,
  )

  return (
    <div className="sim">
      <p className="sim-desc">
        Una sola clave común — <code>{ataque.objetivoDemo}</code> — se prueba contra MUCHOS usuarios (un
        intento por cuenta, para no activar el bloqueo).
      </p>
      <div className="rejilla-usuarios">
        {ataque.usuariosDemo.map((u, idx) => (
          <div
            key={u}
            className={
              'celda-usuario ' +
              (idx <= i ? (idx === idxVulnerable ? 'vulnerable' : 'seguro') : '')
            }
          >
            👤 {u}
            {idx <= i && (idx === idxVulnerable ? ' 🔓' : ' 🔒')}
          </div>
        ))}
      </div>
      <Controles
        corriendo={corriendo}
        onToggle={() => setCorriendo((c) => !c)}
        onReset={() => { setCorriendo(false); setI(-1) }}
        estado={
          i >= idxVulnerable
            ? { tipo: 'exito', texto: `✓ 1 cuenta comprometida (${ataque.usuariosDemo[idxVulnerable]})` }
            : null
        }
      />
    </div>
  )
}

/* ---------- 5. Rainbow table: buscar el hash robado en una tabla ---------- */
function SimRainbow({ ataque }) {
  const [i, setI] = useState(-1)
  const [corriendo, setCorriendo] = useState(false)
  const idxObjetivo = ataque.tablaDemo.findIndex((f) => f.clave === ataque.objetivoDemo)
  const acertado = i === idxObjetivo

  useIntervalo(
    () => setI((prev) => {
      if (prev >= idxObjetivo) { setCorriendo(false); return prev }
      return prev + 1
    }),
    corriendo && !acertado,
    VELOCIDAD,
  )

  return (
    <div className="sim">
      <p className="sim-desc">
        Se robó el hash <code>a1b2c3d4...</code> de la base de datos. Sin "salt", se busca ese hash en una
        tabla precalculada para revertirlo a texto plano.
      </p>
      <table className="tabla-rainbow">
        <thead>
          <tr><th>Hash precalculado</th><th>Clave original</th></tr>
        </thead>
        <tbody>
          {ataque.tablaDemo.map((fila, idx) => (
            <tr key={fila.hash} className={idx === i ? (idx === idxObjetivo ? 'ok' : 'activo') : ''}>
              <td><code>{fila.hash}</code></td>
              <td><code>{idx <= i ? fila.clave : '•••••'}</code></td>
            </tr>
          ))}
        </tbody>
      </table>
      <Controles
        corriendo={corriendo}
        onToggle={() => setCorriendo((c) => !c)}
        onReset={() => { setCorriendo(false); setI(-1) }}
        estado={acertado ? { tipo: 'exito', texto: `✓ Hash revertido → "${ataque.objetivoDemo}"` } : null}
      />
    </div>
  )
}

function Barra({ valor, max }) {
  const pct = Math.min(100, Math.round((valor / max) * 100))
  return (
    <div className="barra">
      <div className="barra-relleno" style={{ width: pct + '%' }} />
      <span className="barra-pct">{pct}%</span>
    </div>
  )
}
