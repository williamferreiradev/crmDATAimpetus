export type CrmStatus = 'novo' | 'em_contato' | 'qualificado' | 'convertido' | 'perdido';

export interface Cliente {
    id: string; // uuid
    whatsapp_id: string; // unique
    nome: string | null;
    status_crm: CrmStatus;
    stage: string; // default 'INTRO'
    trava: boolean; // false = Bot (Auto), true = Human (Manual)
    is_active: boolean; // true = show in board
    qualificado: boolean; // true = Interested
    last_interaction_at: string; // timestamp
}
