import { Request, Response } from "express";
import { createTable } from "../../config/pdfkit";

const fs = require('fs');

interface Item {
    numberOfPatrimony: number,
    description: String,
    locationId: number,
    responsibleRegistration: number | null,
    projectId: number | null,
}

class DownloadPDFReportController {
    async handle(req: Request | any, res: Response) {
        try {
            const data = req.body;

            if (!data) {
                return res.status(200).json({});
            }
            // Convertendo json recebido para uma lista de listas de strings
            var formatedStrDataList: String[][] = [['Nº de Patrimônio', 'Descrição', 'Localização', 'Responsável', 'Projeto']];
            var itemStrDataList = [];
            data.items.forEach((item: Item) => {
                itemStrDataList = [];
                itemStrDataList.push(item.numberOfPatrimony.toString());
                itemStrDataList.push(item.description);
                itemStrDataList.push(item.locationId.toString());
                itemStrDataList.push(item.responsibleRegistration ? item.responsibleRegistration.toString() : '');
                itemStrDataList.push(item.projectId ? item.projectId.toString() : '');
                formatedStrDataList.push(itemStrDataList);
            });
            // Cria o arquivo PDF com tabela
            const filename = createTable('GuardeiUFC - Relatório de Itens', formatedStrDataList);
            // Baixando o arquivo gerado
            const path = process.env.UPLOADS_PATH + '/pdf/' + filename + '.pdf';
            const file = fs.createReadStream(path);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment: filename="' + filename + '.pdf"');
            file.pipe(res);
        } catch (error) {
            console.error(error);
            throw(error);
        }
    }
}

export { DownloadPDFReportController }