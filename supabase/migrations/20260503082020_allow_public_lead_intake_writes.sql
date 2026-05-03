create policy "Allow public lead inserts" on public.opportunities
  for insert to anon
  with check (source in ('contact_form', 'calendar_booking', 'whatsapp', 'diagnostic_script'));

create policy "Allow public lead id reads for chained writes" on public.opportunities
  for select to anon
  using (true);

create policy "Allow public appointment inserts" on public.appointments
  for insert to anon
  with check (true);

create policy "Allow public appointment reads for updates" on public.appointments
  for select to anon
  using (true);

create policy "Allow public appointment confirmations" on public.appointments
  for update to anon
  using (true)
  with check (true);

create policy "Allow public email event inserts" on public.email_events
  for insert to anon
  with check (true);

create policy "Allow public email event reads for insert return" on public.email_events
  for select to anon
  using (true);

create policy "Allow public whatsapp conversation inserts" on public.whatsapp_conversations
  for insert to anon
  with check (true);

create policy "Allow public whatsapp conversation reads" on public.whatsapp_conversations
  for select to anon
  using (true);

create policy "Allow public whatsapp conversation updates" on public.whatsapp_conversations
  for update to anon
  using (true)
  with check (true);

create policy "Allow public whatsapp message inserts" on public.whatsapp_messages
  for insert to anon
  with check (true);

create policy "Allow public whatsapp message reads" on public.whatsapp_messages
  for select to anon
  using (true);
