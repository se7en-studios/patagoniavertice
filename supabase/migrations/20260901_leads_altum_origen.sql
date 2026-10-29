-- Leads multi-origen: tasador, calculadora, guía y formulario comparten leads_altum.
-- NO ejecutada automáticamente: aplicar manualmente en Supabase.
alter table leads_altum add column if not exists origen text;
alter table leads_altum add column if not exists detalle jsonb;

-- Tasador/guía/calculadora solo piden teléfono: email pasa a ser opcional.
alter table leads_altum alter column email drop not null;
alter table leads_altum drop constraint if exists leads_altum_contacto_check;
alter table leads_altum add constraint leads_altum_contacto_check
  check (email is not null or telefono is not null);

-- Nuevos tipos de consulta
alter table leads_altum drop constraint if exists leads_altum_tipo_consulta_check;
alter table leads_altum add constraint leads_altum_tipo_consulta_check
  check (tipo_consulta in ('venta','alquiler','consultoria','contratos','tasacion','inversion','guia'));

create index if not exists leads_altum_origen_idx on leads_altum (origen);
