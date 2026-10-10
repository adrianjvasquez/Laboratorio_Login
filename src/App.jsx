import { useState } from 'react'
import { CREDENCIALES_DEMO, LECCION, ATAQUES } from './data'
import Simulador from './Simulador.jsx'

export default function App() {
  const [autenticado, setAutenticado] = useState(false)
  return autenticado ? (
    <Teoria onSalir={() => setAutenticado(false)} />
  ) : (
    <Login onEntrar={() => setAutenticado(true)} />
  )
}

function Login({ onEntrar }) {
  const [usuario, setUsuario] = useState('')
  const [clave, setClave] = useState('')
  const [error, setError] = useState('')
  const [verClave, setVerClave] = useState(false)

  function enviar(e) {
    e.preventDefault()
    if (usuario === CREDENCIALES_DEMO.usuario && clave === CREDENCIALES_DEMO.clave) {
      setError('')
      onEntrar()
    } else {
      setError('Usuario o contraseña incorrectos.')
    }
  }

  return (
    <div className="login-pantalla">
      <form className="login-tarjeta" onSubmit={enviar}>
        <div className="login-escudo">🛡️</div>
        <h1>Acceso al laboratorio</h1>
        <p className="login-sub">Inicia sesión para ver la teoría de la lección</p>

        <label>
          Usuario
          <input
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            autoComplete="username"
            placeholder="usuario"
          />
        </label>

        <label>
          Contraseña
          <div className="campo-clave">
            <input
              type={verClave ? 'text' : 'password'}
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              autoComplete="current-password"
              placeholder="••••••••"
            />
            <button type="button" className="ver-clave" onClick={() => setVerClave((v) => !v)}>
              {verClave ? '🙈' : '👁️'}
            </button>
          </div>
        </label>

        {error && <div className="login-error">{error}</div>}

        <button type="submit" className="btn-entrar">Entrar</button>

        <div className="login-pista">
          <b>Credenciales de demostración</b>
          <span>Usuario: <code>{CREDENCIALES_DEMO.usuario}</code></span>
          <span>Clave: <code>{CREDENCIALES_DEMO.clave}</code></span>
        </div>
      </form>
    </div>
  )
}

function Teoria({ onSalir }) {
  const [activo, setActivo] = useState(ATAQUES[0].id)
  const ataque = ATAQUES.find((a) => a.id === activo)

  return (
    <div className="teoria">
      <header className="barra-superior">
        <div className="marca">🛡️ <b>Lección 9</b> · Seguridad informática</div>
        <button className="btn-salir" onClick={onSalir}>Cerrar sesión</button>
      </header>

      <main className="contenido">
        <section className="intro">
          <h1>{LECCION.titulo}</h1>
          <p>{LECCION.intro}</p>
          <div className="fundamentos">
            {LECCION.fundamentos.map((f) => (
              <article key={f.titulo} className="fundamento">
                <h3>{f.titulo}</h3>
                <p>{f.texto}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="ataques">
          <h2>Los 5 ataques más frecuentes al inicio de sesión</h2>
          <p className="aviso">
            ⚠️ Las simulaciones son <b>ilustrativas y locales</b>: animan el concepto contra objetivos ficticios.
            No realizan ninguna petición ni atacan sistemas reales. Fin exclusivamente educativo y defensivo.
          </p>

          <nav className="pestanas">
            {ATAQUES.map((a) => (
              <button
                key={a.id}
                className={'pestana ' + (a.id === activo ? 'activa' : '')}
                onClick={() => setActivo(a.id)}
              >
                <span className="pestana-icono">{a.icono}</span>
                {a.nombre}
              </button>
            ))}
          </nav>

          <article className="ficha-ataque">
            <h3>{ataque.icono} {ataque.nombre}</h3>
            <p className="resumen">{ataque.resumen}</p>

            <div className="bloque">
              <h4>🔍 ¿Qué ocurre internamente?</h4>
              <p>{ataque.interno}</p>
            </div>

            <div className="bloque bloque-sim">
              <h4>🧪 Simulación ilustrativa</h4>
              <Simulador ataque={ataque} />
            </div>

            <div className="bloque bloque-prevencion">
              <h4>🛡️ Cómo prevenirlo o evitarlo</h4>
              <ul>
                {ataque.prevencion.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
          </article>
        </section>
      </main>

      <footer className="pie">
        Material educativo · Uparsistem · Ciberseguridad · Laboratorio 9
      </footer>
    </div>
  )
}
