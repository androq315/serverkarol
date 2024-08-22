import { Router } from "express";
import UsuarioController from "../controllers/usuario.controller.js";

const router = Router();

router.get( '/api/usuario',  UsuarioController.getUsuarios )
router.get( '/api/usuario/:id',  UsuarioController.getUsuario )
router.put( '/api/usuario/:id',  UsuarioController.putUsuario )
router.post( '/api/usuario',  UsuarioController.postUsuario )

export default router;