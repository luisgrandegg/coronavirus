export interface IMailTemplateData {
    [key: string]: string;
}

export interface IMail {
    dynamic_template_data: IMailTemplateData;
    from: string;
    templateId: string;
    to: string;
}

export abstract class Mail {
    abstract name: string;

    constructor(
        public dynamicTemplateData: {
            [key: string]: string,
        },
        public to: string,
        public from?: string,
        public templateId?: string,
    ) {}

    toJson(): IMail {
        return {
            dynamic_template_data: this.dynamicTemplateData,
            from: this.from,
            templateId: this.templateId,
            to: this.to,
        };
    }
}
