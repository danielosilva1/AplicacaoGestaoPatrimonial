import { Request, Response } from "express";
import { database } from "../../database";
import { Prisma } from "@prisma/client";

class DeleteUserController {
    async handle(req: Request, res: Response) {
        try {
            const username = req.params.username;

            if (!username) {
                return res.status(404).json({mensagem: "O username do usuário é obrigatório"});
            }

            const user = await database.user.findFirst({
                where: { username: { equals: username, mode: 'insensitive' } }
            });

            if (!user) {
                return res.status(400).json({mensagem: "Usuário não encontrado"});
            }

            // Deletando dados do funcionário
            const deletedEmp = await database.employee.delete({
                where: {
                    registration: user.employeeRegistration
                }
            });

            // Deletando dados do usuário
            const deletedUser = await database.user.delete({
                where: { id: user.id }
            });

            return res.status(200).json({deletedUser, deletedEmp});
        } catch (error) {
            // Tratando erro de restrição de chave
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code == 'P2003') {
                // Um erro de restrição de chave ocorreu, informa o fato
                return res.status(400).json({mensagem: "Usuário não pode ser excluído pois funcionário associado está vinculado a Projeto ou a uma solicitação de relatório!"});
            }
            console.error(error);
            throw(error);
        }
    }
}

export { DeleteUserController }