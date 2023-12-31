import { Request, Response } from "express";
import { database } from "../../../database";

class GetItemsReportController {
    async handle(req: Request | any, res: Response) {
        try {
            let  numberOfPatrimony = req.query.numberOfPatrimony;
            let  name = req.query.name;
            let  description = req.query.description;
            let  locationId = req.query.locationId;
            let  status = req.query.status;
            let  responsibleRegistration = req.query.responsibleRegistration;
            let  projectId = req.query.projectId;
            
            let filteredItems = await database.item.findMany();

            if (!filteredItems) {
                return res.status(200).json({filteredItems: {}});
            }

            // Garantindo que usuário comum irá filtrar apenas itens que ele é responsável ou que estejam vinculados a projetos que ele coordena
            if (req.userRole == "commom") {
                let loggedUser = await database.user.findUnique({
                    where: {id: req.userId}
                });
                responsibleRegistration = loggedUser?.employeeRegistration;
            }            

            // Filtrando por número de patrimônio (correspondência exata)
            if (numberOfPatrimony) {
                filteredItems = filteredItems.filter((item) => {
                    return (item.numberOfPatrimony == numberOfPatrimony);
                });
            }

            // Matrícula do responsável (correspondência exata)
            if (responsibleRegistration) {
                filteredItems = filteredItems.filter((item) => {
                    return (item.responsibleRegistration == responsibleRegistration);
                });
            }

            // Localização (correspondência exata com base no id do lugar)
            if (locationId) {
                filteredItems = filteredItems.filter((item) => {
                    return (item.locationId == locationId);
                });
            }

            // Nome do projeto (correspondência exata com base no id do projeto)
            if (projectId) {
                filteredItems = filteredItems.filter((item) => {
                    return (item.projectId == projectId);
                });
            }

            // Status (1: alocado a funcionário/projeto; 2: disponível; e 3: todos)
            if (status == 1) {
                // Filtrar projetos que estão vinculados a funcionário ou projeto
                filteredItems = filteredItems.filter((item) => {
                    return (item.responsibleRegistration != null || item.projectId != null);
                });
            } else if (status == 2) {
                // Filtrar projetos que não estão vinculados a funcionário nem a projeto
                filteredItems = filteredItems.filter((item) => {
                    return (item.responsibleRegistration == null && item.projectId == null);
                });
            }

            // Nome do projeto (correspondência parcial sem diferencias maiúsculas e minúsculas)
            if (name) {
                filteredItems = filteredItems.filter((item) => {
                    return (item.name.toLowerCase().includes(name.toLowerCase()));
                });
            }
            
            // Descrição (correspondência parcial sem diferencias maiúsculas e minúsculas)
            if (description) {
                filteredItems = filteredItems.filter((item) => {
                    return (item.description.toLowerCase().includes(description.toLowerCase()));
                });
            }

            return res.status(200).json({
                items: filteredItems
            });
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export { GetItemsReportController }