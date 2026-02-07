export type CrmStatus = 'novo' | 'em_contato' | 'qualificado' | 'convertido' | 'perdido';

export interface Cliente {
    id: string; // uuid
    whatsapp_id: string; // unique
    nome: string | null;
    status_crm: string; // default 'novo'
    stage: string; // default 'INTRO'
    trava: boolean; // false = Bot (Auto), true = Human (Manual)
    is_active: boolean; // true = show in board
    qualificado: boolean; // true = Interested
    created_at: string; // timestamp
    metadata: any; // JSON metadata
}
