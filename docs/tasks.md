- **Currency Converter Issue**
    - Currently just outputs the same number without converting.
    - Suggestion: move the currency headers to the position of the dropdown.

- **Add New Watch – Batch Group Bug**
    - When creating a new Batch Group inside _Add New Watch_, all previously entered data (name, brand, cost, location, images, etc.) is lost.

- **Core Flow Testing (must be smooth & stable without losing data)**
    1. Add New Watch
    2. Fill in Name
    3. Select Brand
    4. Enter Cost in a currency (e.g., Vietnamese dong)
    5. Pick Location
    6. Select Batch Group (or create a new one if not existing)
    7. Drag in 20 images
    8. Click **Save & Close**
        - ✅ Expected: interface should show a **visual indicator / lock state** while uploading & saving.
        - ❌ Current issue: interface doesn’t always lock, sometimes loses unsaved data.

- **AI Description Flow**
    - After adding Serial, Ref, Case Size, Caliber, Timegrapher → select AI images → click _Generate Description_.
    - If the user closes the window before AI response/webhook comes back, it should **still save and work in background**.
    - Use a **processing indicator** (similar to Multi-platform Sales → “View Data” change Platform → shows indicator).
