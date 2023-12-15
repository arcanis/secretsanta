function debug(data) {
    if (false)
        console.log(data)
}

function convertInput(inputData) {
    const output = [];

    inputData.names.forEach((name) => {
        const entry = { name, exclude: [] };

        if (inputData.blacklists[name]) {
            entry.exclude = inputData.blacklists[name];
        }

        if (inputData.enforced[name]) {
            entry.enforced = inputData.enforced[name];
        }

        output.push(entry);
    });

    debug({ inputData, output })

    return output;
}

function convertOutput(selectedParticipants) {
    const newResult = Object.create(null);

    for (let i = 0; i < selectedParticipants.length; i++) {
        let j = i === 0 ? selectedParticipants.length - 1 : i - 1;

        const participant = selectedParticipants[i];
        const previousParticipant = selectedParticipants[j];

        newResult[previousParticipant.name] = participant.name

        debug(`[${i}] ${previousParticipant.name} -> ${participant.name}`);
    }

    debug({ newResult })
    return newResult
}

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function findNextParticipant(participants, selectedParticipants, participant) {
    const remainingOptions = participants.filter(
        (nextParticipant) => {
            if (!participant.enforced) {
                const nextParticipantIsNotExcluded = !participant.exclude.includes(nextParticipant.name)
                const nextParticipantIsDiffFromCurrent = nextParticipant.name !== participant.name
                const nextParticipantIsNotAlreadySelected = !selectedParticipants.includes(nextParticipant)
                const nextParticipantIsNotEnforcedToOtherParticipant = !participants.some(_participant => _participant.enforce === nextParticipant.name)

                debug({
                    act: participant.name,
                    next: nextParticipant.name,
                    nextParticipantIsNotEnforcedToOtherParticipant,
                    nextParticipantIsNotAlreadySelected,
                    nextParticipantIsDiffFromCurrent,
                    nextParticipantIsNotExcluded
                })

                return nextParticipantIsNotEnforcedToOtherParticipant &&
                    nextParticipantIsNotAlreadySelected &&
                    nextParticipantIsDiffFromCurrent &&
                    nextParticipantIsNotExcluded
            } else {
                return nextParticipant.name === participant.enforced &&
                    nextParticipant.name !== participant.name &&
                    !selectedParticipants.includes(nextParticipant)
            }
        }
    );

    if (remainingOptions.length === 0) {
        console.error("No remaining options");
        return;
    }

    return getRandomItem(remainingOptions);
}

// finds last unselected participant, validating if the first participant is not in the last participant's exclusion list
function validateLastWithFirstParticipant(selectedParticipants) {
    const firstSelectedParticipant = selectedParticipants[0];
    const lastSelectedParticipant =
        selectedParticipants[selectedParticipants.length - 1];

    const lastParticipantCanSelectFirstParticipant =
        !lastSelectedParticipant.exclude.includes(firstSelectedParticipant.name);

    return lastParticipantCanSelectFirstParticipant;
}

// generate list of participants sorted by the gifter -> gifted
function generateResult(inputData) {
    let i = 0;
    let selectedParticipants = [];
    const participants = convertInput(inputData)
    while (++i < 100) {
        selectedParticipants.push(getRandomItem(participants));

        while (selectedParticipants.length <= participants.length) {
            const lastSelectedParticipant =
                selectedParticipants[selectedParticipants.length - 1];
            const nextParticipant = findNextParticipant(
                participants,
                selectedParticipants,
                lastSelectedParticipant,
            );

            if (!nextParticipant) {
                break;
            }

            selectedParticipants.push(nextParticipant);
        }
        const isAllowedLastWithFirst =
            validateLastWithFirstParticipant(selectedParticipants);

        debug({ selectedParticipants, participants })
        if (
            !isAllowedLastWithFirst ||
            selectedParticipants.length !== participants.length
        ) {
            selectedParticipants = [];
            console.error(`Cannot match all participants in try ${i}, trying again.`);
        } else {
            break;
        }
    }

    return convertOutput(selectedParticipants);
}


var SecretSanta = function() {

    this.names = [];

    this.enforced = Object.create(null);
    this.blacklists = Object.create(null);
};


SecretSanta.prototype.add = function(name) {

    if (this.names.indexOf(name) !== -1)
        throw new Error('Cannot redefine ' + name);

    this.names.push(name);

    var subapi = {};

    subapi.enforce = function(other) {

        this.enforced[name] = other;

        return subapi;

    }.bind(this);

    subapi.blacklist = function(other) {

        if (!Object.prototype.hasOwnProperty.call(this.blacklists, name))
            this.blacklists[name] = [];

        if (this.blacklists[name].indexOf(other) === -1)
            this.blacklists[name].push(other);

        return subapi;

    }.bind(this);

    return subapi;

};

SecretSanta.prototype.generate = function() {
    const inputData = {
        names: this.names ?? [],
        blacklists: this.blacklists ?? [],
        enforced: this.enforced ?? {},
    }

    var result = generateResult(inputData)

    return result;
};