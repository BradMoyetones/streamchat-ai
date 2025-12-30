# 🚀 Multi-LLM Streaming Hub

Este proyecto es una interfaz moderna desarrollada en **Next.js** diseñada para interactuar con múltiples modelos de lenguaje de gran escala (LLMs) de forma fluida. Lo que hace especial a esta aplicación es su capacidad de alternar dinámicamente entre diferentes proveedores de IA para garantizar disponibilidad y velocidad extrema.

---

### 🧠 El Concepto

La aplicación se conecta a un backend optimizado que actúa como un **orquestador de servicios de IA**. En lugar de depender de una sola API, el sistema implementa una lógica de "Round Robin" para distribuir las peticiones entre diversos proveedores, permitiendo:

* **Streaming en tiempo real:** Respuestas instantáneas palabra por palabra.
* **Alta disponibilidad:** Si un servicio falla o alcanza su límite, el sistema utiliza el siguiente en la lista.
* **Multi-Model Support:** Integración nativa con servicios de alto rendimiento como **Groq**, **Cerebras** y preparado para expandirse a Gemini, OpenRouter o modelos locales.

---

### 🛠️ Tecnologías Principales

* **Frontend:** [Next.js](https://nextjs.org/) (App Router) para una experiencia de usuario reactiva y optimizada.
* **Backend Runtime:** [Bun](https://bun.sh/) para un procesamiento de peticiones ultra rápido.
* **Protocolo:** **Server-Sent Events (SSE)** para el manejo de streams de datos constantes.
* **Proveedores de IA:** Integración con APIs de baja latencia (Groq, Cerebras).

---

### 📋 Características Clave

1. **Balanceo de Carga (Load Balancing):** Distribución inteligente de mensajes entre diferentes servicios para maximizar el throughput.
2. **Interfaz de Chat Fluida:** Una UI limpia inspirada en los mejores estándares actuales, optimizada para la lectura de respuestas largas en streaming.
3. **Arquitectura Extensible:** Fácil de añadir nuevos servicios o modelos locales simplemente registrándolos en el orquestador.
4. **Eficiencia Energética y de Memoria:** Gracias al uso de Bun en el lado del servidor, el consumo de recursos es mínimo.

---

### 🚀 Cómo empezar

1. **Clona el repositorio**
2. **Instala las dependencias:** `npm install` o `bun install`.
3. **Configura tus variables de entorno:** Añade tus API Keys de los servicios correspondientes.
4. **Inicia el modo desarrollo:** `npm run dev` o `bun dev`.

---

> **Nota:** Este proyecto está diseñado para ser la base de una plataforma de chat agnóstica al modelo, enfocándose en la velocidad de respuesta y la resiliencia del servicio.