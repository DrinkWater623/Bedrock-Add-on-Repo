XP Bank

Planning Phase

We will need a job que.. unless I have different intervals running and it finds all players
with that interval with isAuto on....  run every 5 min with a inc of 5 and do a mod 5 10 15 20
maybe a scoreboard with the increments - that refreshes every 30 min or so

Player will need Fields
{
    initialized
    isAutoSaver
    autoSaveOver
    autoSaveIncrement - 1 min to 
    xpBalance
    ?? see if can save xp at death
}

pseudo code - python indentation - just logical english

1) player spawn
    new {
        create fields
        send message with info about bank and settings
        return
    }
    not new {
        if isAutoSaver == true
            get autoSaveIncrement
            run Auto Saver Interval Job (2) for player @ increment
        return
    }

2) Auto Saver Job {
    isAutoSaver == false
        turn this job off
        return

    isAutoSaver == true (assumed)    
        get auto save over amount
        if player's xp balance > auto save over amount
            add overage to bank
            reduce player XP

        return
}

3) Commands  (one day use D D U I)
    a) /my_xp in chat message

    b) /dep_xp or /save_xp #

    c) /withdraw_xp or /get_xp #
        warn if withdraw amount is over what they have save
        warn if withdraw amount will affect autosave (will turn off - they have to turn back on)

    d) /autosave_xp_over #

    e) /stop_auto_save_xp

    f) /xp_bank_form

    g) /auto_save_now

4) Player Dies
    if job running
        stop job (it will start again when they spawn back in)

5) Player Leaves
    if job running
        Stop Job