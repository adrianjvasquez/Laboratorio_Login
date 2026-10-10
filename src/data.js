// Contenido teórico de la lección.
// Todo es material educativo/defensivo: no hay código de ataque real,
// solo descripciones y simulaciones ilustrativas para aprender a PREVENIR.

export const CREDENCIALES_DEMO = {
  usuario: 'estudiante',
  clave: 'Uparsistem2026',
}

export const LECCION = {
  titulo: 'Seguridad en el inicio de sesión',
  intro:
    'El formulario de login es una de las puertas más atacadas de cualquier aplicación. ' +
    'Entender cómo funcionan los ataques "a la fuerza" es el primer paso para construir defensas sólidas. ' +
    'Esta lección explica los 5 ataques más frecuentes, qué ocurre internamente y cómo mitigarlos.',
  fundamentos: [
    {
      titulo: 'Autenticación vs. Autorización',
      texto:
        'Autenticar es verificar QUIÉN eres (usuario + clave, MFA). Autorizar es decidir QUÉ puedes hacer. ' +
        'Un ataque a la fuerza busca romper la autenticación para luego heredar la autorización de la víctima.',
    },
    {
      titulo: '¿Por qué funcionan estos ataques?',
      texto:
        'Casi siempre por el factor humano: contraseñas cortas, reutilizadas o predecibles, y por servidores que ' +
        'no limitan los intentos ni registran la actividad sospechosa.',
    },
    {
      titulo: 'Principio de defensa en profundidad',
      texto:
        'Ninguna medida basta por sí sola. Se combinan varias capas (límite de intentos, MFA, hashing fuerte, ' +
        'monitoreo) para que, si una falla, las demás contengan el ataque.',
    },
  ],
}

export const ATAQUES = [
  {
    id: 'fuerza-bruta',
    nombre: 'Fuerza bruta',
    icono: '🔨',
    resumen:
      'Probar sistemáticamente todas las combinaciones posibles de caracteres hasta acertar la contraseña.',
    interno:
      'El atacante automatiza miles de peticiones POST al endpoint de login variando la contraseña ' +
      '(aaaa, aaab, aaac...). Cada intento genera una respuesta del servidor; la diferencia entre "credencial ' +
      'inválida" y "acceso correcto" le indica cuándo acertó. El costo crece exponencialmente con la longitud: ' +
      'una clave de 4 dígitos tiene 10.000 combinaciones; una de 8 con mayúsculas, minúsculas, números y símbolos, ' +
      'billones.',
    prevencion: [
      'Límite de intentos (rate limiting) y bloqueo temporal tras N fallos.',
      'CAPTCHA tras varios intentos fallidos para frenar la automatización.',
      'Exigir contraseñas largas y complejas (12+ caracteres).',
      'MFA: aunque adivinen la clave, falta el segundo factor.',
    ],
    // Espacio de búsqueda ilustrativo para la animación (PIN corto).
    objetivoDemo: '7391',
    alfabetoDemo: '0123456789',
  },
  {
    id: 'diccionario',
    nombre: 'Ataque de diccionario',
    icono: '📖',
    resumen:
      'En vez de todas las combinaciones, se prueba una lista de palabras y contraseñas comunes ya conocidas.',
    interno:
      'El atacante usa listas (como "rockyou.txt") con millones de contraseñas filtradas en brechas previas. ' +
      'Es mucho más rápido que la fuerza bruta porque la gente tiende a usar claves predecibles: "123456", ' +
      '"password", "qwerty", nombres, fechas. El servidor recibe intentos con palabras reales en lugar de ' +
      'combinaciones aleatorias.',
    prevencion: [
      'Bloquear contraseñas comunes mediante listas de denegación.',
      'Medidor de fortaleza que rechace claves débiles al registrarse.',
      'Fomentar frases de contraseña largas y únicas.',
      'Gestor de contraseñas para evitar claves memorizables/predecibles.',
    ],
    objetivoDemo: 'qwerty',
    diccionarioDemo: ['123456', 'password', 'admin', 'qwerty', 'iloveyou', 'welcome'],
  },
  {
    id: 'credential-stuffing',
    nombre: 'Credential stuffing (relleno de credenciales)',
    icono: '♻️',
    resumen:
      'Reutilizar usuario+clave robados de OTRO sitio, apostando a que la víctima repite credenciales.',
    interno:
      'Tras una filtración de datos, el atacante obtiene pares usuario:clave reales. Los prueba masivamente ' +
      'en muchos servicios distintos de forma automatizada. No adivina nada: aprovecha que el 60-70% de las ' +
      'personas reutiliza la misma contraseña. Un único acierto en el sitio original abre decenas de cuentas.',
    prevencion: [
      'NUNCA reutilizar contraseñas entre servicios.',
      'MFA, que invalida la clave robada por sí sola.',
      'Detección de credenciales filtradas (ej. "Have I Been Pwned").',
      'Alertas de inicio de sesión desde dispositivos/ubicaciones nuevas.',
    ],
    objetivoDemo: { usuario: 'ana@correo.com', clave: 'Verano2023' },
    listaDemo: [
      { usuario: 'luis@correo.com', clave: 'Perrito123' },
      { usuario: 'ana@correo.com', clave: 'Verano2023' },
      { usuario: 'juan@correo.com', clave: 'Messi10' },
    ],
  },
  {
    id: 'password-spraying',
    nombre: 'Password spraying (rociado de contraseñas)',
    icono: '🌧️',
    resumen:
      'Probar UNA clave muy común contra MUCHOS usuarios distintos, en lugar de muchas claves contra uno.',
    interno:
      'Es el inverso de la fuerza bruta. Para evitar el bloqueo por intentos fallidos (que es por usuario), ' +
      'el atacante prueba "Primavera2026" en miles de cuentas, luego espera y prueba otra clave común. ' +
      'Así se mantiene por debajo del umbral de bloqueo de cada cuenta y pasa desapercibido. Basta con que ' +
      'pocas personas usen esa clave para comprometer varias cuentas.',
    prevencion: [
      'Monitorear intentos fallidos por IP/global, no solo por usuario.',
      'Prohibir contraseñas comunes y patrones estacionales (Verano2026).',
      'MFA en todas las cuentas, especialmente las privilegiadas.',
      'Detección de anomalías: muchas cuentas fallando con la misma clave.',
    ],
    objetivoDemo: 'Primavera2026',
    usuariosDemo: ['carlos', 'maria', 'pedro', 'lucia', 'diego', 'sofia'],
  },
  {
    id: 'rainbow-table',
    nombre: 'Rainbow tables (tablas arcoíris)',
    icono: '🌈',
    resumen:
      'Si se roban los hashes de la base de datos, se usan tablas precalculadas para revertirlos a texto plano.',
    interno:
      'Las contraseñas no deberían guardarse en texto plano, sino como hash (una huella irreversible). ' +
      'Pero si el hash es débil (MD5/SHA1 sin "salt"), el atacante usa tablas con millones de hashes ya ' +
      'calculados y simplemente busca el valor robado en la tabla para hallar la clave original. El "salt" ' +
      '(un valor aleatorio único por usuario) hace inútiles estas tablas, porque cambia el hash resultante.',
    prevencion: [
      'Hashing lento y moderno: bcrypt, scrypt o Argon2.',
      'Usar "salt" único por usuario para romper las tablas precalculadas.',
      'Añadir "pepper" (secreto del servidor) además del salt.',
      'Nunca MD5/SHA1 para contraseñas: son demasiado rápidos de revertir.',
    ],
    objetivoDemo: 'hola123',
    tablaDemo: [
      { hash: '5f4dcc3b...', clave: 'password' },
      { hash: 'e10adc39...', clave: '123456' },
      { hash: 'a1b2c3d4...', clave: 'hola123' },
      { hash: 'f7c3bc1d...', clave: 'qwerty' },
    ],
  },
]
