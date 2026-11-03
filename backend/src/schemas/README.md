# schemas/ — validación declarativa (nivel Sobresaliente)

En este esqueleto la validación de entrada está escrita a mano en los controladores para que se vea qué se comprueba. En el nivel **Sobresaliente** de la rúbrica del Hito 2 se pide **validación declarativa de esquemas** (Zod, Joi, class-validator, Form Requests…):

1. Define un esquema por operación en esta carpeta (`auth.schema.js`, `citas.schema.js`…).
2. Crea un middleware `validateSchema(schema)` que aplique el esquema y, si falla, responda con `validationProblem(req, res, errors)` (`422`).
3. Enchúfalo en la ruta: `router.post('/register', validateSchema(registerSchema), authController.register)`.

Así el controlador recibe datos ya validados y se reduce a orquestar. Añade la dependencia que elijas solo cuando la uses.
