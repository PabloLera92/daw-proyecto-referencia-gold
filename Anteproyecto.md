# Anteproyecto: GesTaller

**Módulo:** Proyecto Intermodular (0379 · PIDW2) — 2º DAW Virtual
**Centro:** CIFP Avilés (Curso 2026/2027)
**Autor/a:** Alumno Ejemplo (ficticio)
**Repositorio GitHub:** https://github.com/PabloLera92/daw-proyecto-referencia-gold
**Tablero GitHub Projects:** https://github.com/users/alumno-ejemplo/projects/1 (enlace simulado)

> **Nota para el alumno.** Este es el entregable del Hito 1 resuelto para un dominio ficticio. Sigue la estructura de la plantilla oficial, pero el contenido de tu anteproyecto debe ser **propio y específico**: en el Hito 1 se rechaza como NO-GO un dominio copiado de un tutorial o reutilizado de otro proyecto. Se entrega además en PDF (portada institucional, índice paginado, tercera persona). Borra este recuadro en tu versión.

---

## 1. Justificación y dominio funcional

### 1.1. Elevator pitch (100–150 palabras)

Los talleres mecánicos independientes gestionan hoy las citas por teléfono y las órdenes de reparación en papel o en hojas de cálculo. Esto provoca citas solapadas, presupuestos que no coinciden con la factura final y clientes que llaman para saber si su coche está listo. GesTaller es una aplicación web que centraliza la agenda de citas, la apertura de la orden de reparación a partir de cada cita y el registro de los servicios y piezas empleados. El cliente consulta el estado de su vehículo desde el móvil, el mecánico anota el trabajo realizado sin papel y el administrador conserva el precio pactado de cada línea, de modo que un cambio posterior de tarifas no altera las órdenes ya cerradas. El resultado es menos llamadas, menos errores de facturación y trazabilidad completa de cada reparación.

### 1.2. Público objetivo y contexto de uso

El público objetivo son talleres de entre uno y diez empleados. El administrador (propietario o gestor) usa la aplicación desde el ordenador del taller. Los mecánicos la consultan desde una tableta o el móvil junto al vehículo. Los clientes acceden desde el móvil, en cualquier momento, para pedir cita o ver el estado de su orden.

---

## 2. Roles del sistema y casos de uso

### 2.1. Matriz de roles (RBAC)

- **Administrador:** gestiona usuarios, catálogo de servicios, agenda completa, órdenes y facturas. Acceso total.
- **Usuario registrado:** se concreta en dos perfiles.
  - **Mecánico:** consulta su agenda, abre y actualiza las órdenes que tiene asignadas y registra las líneas de trabajo.
  - **Cliente:** registra sus vehículos, solicita y cancela sus citas y consulta sus órdenes.
- **Público / invitado:** consulta el catálogo de servicios en modo solo lectura y accede al registro y al inicio de sesión.

### 2.2. Casos de uso principales (mínimo 6)

1. **CU-01:** Registro e inicio de sesión seguro con tokens JWT (Público → Cliente).
2. **CU-02:** Gestión del catálogo de servicios y de sus precios base (Administrador).
3. **CU-03:** Consulta de la agenda global y de la facturación emitida (Administrador).
4. **CU-04:** Alta de un vehículo propio y solicitud de una cita para una fecha y hora libres (Cliente).
5. **CU-05:** Cancelación o modificación de una cita pendiente (Cliente).
6. **CU-06:** Apertura de la orden de reparación a partir de una cita confirmada y registro de servicios con cantidad, precio pactado y descuento (Mecánico).
7. **CU-07:** Consulta del estado y del detalle de las órdenes propias (Cliente).
8. **CU-08:** Emisión de la factura de una orden finalizada (Administrador).

### 2.3. Alcance del MVP (Hito 3, diciembre)

- **Incluido:** CU-01, CU-02, CU-04, CU-05, CU-06 y CU-07, operativos en producción bajo HTTPS.
- **Fuera del MVP:** emisión de facturas en PDF (CU-08 queda como add-on), notificaciones por correo y estadísticas avanzadas de facturación.

---

## 3. Entidades de negocio tentativas

- **Entidades principales:**
  - **Vehículo:** coche de un cliente, identificado por su matrícula.
  - **Servicio:** operación del catálogo del taller (cambio de aceite, revisión de frenos) con su precio base.
  - **Cita:** reserva de una fecha y hora para llevar un vehículo al taller.
  - **Orden de reparación:** trabajo abierto a partir de una cita, asignado a un mecánico y con su estado.
  - **Factura:** documento emitido al cerrar una orden.
- **Relación transaccional principal prevista:** Orden de reparación ↔ Servicio. Registra qué servicios se aplican en cada orden, con qué cantidad y a qué precio pactado.
- **Nota:** el diagrama Entidad-Relación en 3FN se entrega en el Hito 2 (`docs/der.md`).

---

## 4. Stack tecnológico previsto

- **Motor de base de datos:** MySQL 8 — modelo relacional con integridad referencial para una operativa transaccional.
- **Backend API:** Node.js 20 + Express — mismo lenguaje que el frontend y arquitectura en capas explícita.
- **Frontend:** React 18 + Vite — SPA desacoplada que consume la API y permite guards de ruta por rol.
- **Alojamiento cloud previsto:** Render (backend y frontend) y Railway (base de datos) — planes gratuitos con HTTPS automático.

---

## 5. Selección tentativa de Add-ons (mínimo 2)

- [ ] Dockerización multicontenedor con Docker Compose (+1.0)
- [ ] Pipeline CI/CD automatizado con GitHub Actions (+1.0)
- [ ] Almacenamiento desacoplado en AWS S3 / Cloudinary (+0.5)
- [ ] Pasarela de pagos Stripe en entorno Sandbox con Webhooks (+1.0)
- [x] Generación de informes en PDF/Excel en backend (+0.5) — facturas en PDF (CU-08)
- [ ] WebSockets / Comunicación en tiempo real (+1.0)
- [ ] Batería de pruebas automatizadas (>40 % de endpoints) (+1.0)
- [x] Documentación OpenAPI / Swagger interactiva (+0.5) — ver `docs/api/openapi.yaml`
