Hej ✨ Välkommen till min bokningsdomän! Såhär kan du Dema min sida.

Demo UI Körinstruktioner (steg för steg)

1. Starta demo-miljön
   Steg 1.1 -> Starta servern
   I projektets rotkatalog:
   npm run demo:ui

Förväntat resultat i terminalen:
Demo UI running on http://localhost:5050

➡️ Detta bekräftar att Express-servern och demo-adaptern är igång.
Steg 1.2 –> Öppna UI:t
Öppna webbläsaren och gå till:
http://localhost:5050

Du ska nu se sidan:
“Bokningar Vörderåsgårdens pensionat – Demo UI”

2. Kör demon - exakt ordning
   Steg 2.1 -> Klicka 'Reset demo state'
   (Syfte: Säkerställa deterministiskt starttillstånd)

Statusrutan visar: "Demo state reset"

Under Rooms (read-only state) visas:

- Vaktmästaren (capacity: 2) – No bookings
- Suiten (capacity: 4) – No bookings

✔️ Domänen är nu i ett definierat initialt tillstånd.

---

Steg 2.2 -> UC1: Skapa bokning (tillåtet scenario)
Domänregel: Rum måste vara tillgängligt och ha tillräcklig kapacitet.

Kontrollera fälten:
From: 2026-02-01
To: 2026-02-03
Guests: 2

Klicka 'Create'
Förväntat resultat:

Status: Created booking: <id>

“Last created booking id” fylls i
Under Rooms visas en bokning med: Status: CREATED

✔️ Domänen accepterar bokningen och övergår till nytt giltigt tillstånd.

---

Steg 2.3 -> UC1 (negativt): Ingen tillgänglighet

Domänregel: Rum får inte dubbelbokas vid överlappande datum.

Klicka FÖRST på: 'Seed no-availability'
Klicka sedan på: 'Create overlapping (expect deny)'

Förväntat resultat:

Båda rum "bokade"
Status visar domänregel, t.ex.:

No available rooms for the selected dates
Ingen ny bokning skapas
Antalet bokningar är oförändrat

✔️ Domänen nekar korrekt utan att ändra tillstånd.

Klicka 'Reset demo state'
Klicka 'Create'

---

Steg 2.4 –> UC2: Avboka som administratör

Domänregel: Endast administratörer får avboka.

Kontrollera att Booking ID är ifyllt
(fältet fylls automatiskt från UC1)

[x] Kryssa i 'Cancel as admin'

Klicka 'Cancel'

Förväntat resultat:
Status:
Cancelled booking

Bokningen visas nu med status: CANCELLED

✔️ Domänen tillåter giltig tillståndsövergång.

klicka 'Create' för att skapa en ny aktiv bokning

---

Steg 2.5 -> UC2 (negativt): Försök avboka som icke-admin

Domänregel: Behörighet krävs.
Lämna [] 'Cancel as admin' okryssad

Klicka 'Attempt cancel as non-admin (expect deny)'

Förväntat resultat:
Status:
Only administrators can cancel bookings

Bokningens status förblir oförändrad

✔️ Domänen nekar utan sidoeffekter.

---

Steg 2.6 –> Läs domänens slutläge

Klicka 'Refresh state'

Inspektera Rooms (read-only state)

Du ska tydligt se:
=> vilka bokningar som är CREATED
=> vilka som är CANCELLED
=> att ingen otillåten ändring har halkat in i domänlogiken!

---

✔️ UI:t speglar alltså som hela detta projekt handlar om - bara domänens tillstånd. Ingen logik finns i frontend!

📞Du kan exponera use cases i terminalen med,
samt verifiera domänlogiken med mina automatiska enhetstester!

TEST KOMMANDO:
'npm run test'

CLI DEMO KOMMANDO:
'npm run demo'
