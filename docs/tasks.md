Batch Filter list works, but when I select Batch B033 the list gets empty?
fiexed: solved by updating lower batch name to original + query otimized

Unclicking Status filters is not working, if you click them again (used to work)
fixed: Now currently working as toggle

SEIKO LM 8N0898 - said AI description failed, but make,com - can't see error message on this one.
Answers: Make,com sometimes returning empty message or wrong response structures formats.

SEIKO KS CHRONOMETER AUTO 220831 - same error, its success in MAKE, is it something with the json or can you see where the problem is? or some special character?
Answers: I am not sure and I think the same issues as as returning response somthing message got empty

dicission: for those make ai things we'll create more logger level to monitor it from server.

still face error downloading image sometimes, some server/permission issue?
Answers: I believe there no issue in the test server so that the image can read anyone.
suggest: Make sure you are handling accuralty by prompt instructions or ai tools uses.
example: curl -o SEI-SKC-0001_009.jpg https://test.secondvintage.com/storage/watches/images/SEI-SKC-0001_009.jpg

The description from the list view didn't update after the animated processing indicator.
fixed: by updating the react local state.

Does the AI select gets saved when you click on Generate Description? you don't see in interface when clicking Generate Description
Ansers: only saved
In grid view processing indicator is missing on description

Cost column layout, its now showing € euro in the top numbers - it should be euro in 1. line and Original Cost in 2. line
Test Cost sorting when it says € euro in all at top
