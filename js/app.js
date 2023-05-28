class Model {
    constructor() {
        if (!localStorage.attendance) {
            console.log('Creating attendance records...');
            function getRandom() {
                return (Math.random() >= 0.5);
            }

            var nameColumns = $('tbody .name-col'),
                attendance = {};

            nameColumns.each(function () {
                let name = this.innerText;
                attendance[name] = [];

                for (var i = 0; i <= 11; i++) {
                    attendance[name].push(getRandom());
                }
            });

            localStorage.attendance = JSON.stringify(attendance);
        }
    }

    getAttendance() {
        return JSON.parse(localStorage.attendance);
    }

    setAttendance(newAttendance) {
        localStorage.attendance = JSON.stringify(newAttendance);
    }

    getMissing() {
        return $('tbody .missed-col'); // Ideally, this would be retrieved from the model attributes itself but I assume we are emulating a page with admin privilages.
    }
}

class View {
    constructor() {

    }

    renderAttendance(attendance) {
        // Check boxes, based on attendace records
        $.each(attendance, function (name, days) {
            let studentRow = $('tbody .name-col:contains("' + name + '")').parent('tr'),
                dayChecks = $(studentRow).children('.attend-col').children('input');

            dayChecks.each(function (i) {
                $(this).prop('checked', days[i]);
            });
        });
    }

    renderMissing($allMissed) {
        $allMissed.each(function () {
            let studentRow = $(this).parent('tr'),
                dayChecks = $(studentRow).children('td').children('input'),
                numMissed = 0;

            dayChecks.each(function () {
                if (!$(this).prop('checked')) {
                    numMissed++;
                }
            });

            $(this).text(numMissed);
        });
    }

    bindCheckEvent(handler) {
        let $allCheckboxes = $('tbody input');

        $allCheckboxes.on('click', function() {
            var studentRows = $('tbody .student'),
                newAttendance = {};
    
            studentRows.each(function() {
                var name = $(this).children('.name-col').text(),
                    $allCheckboxes = $(this).children('td').children('input');
    
                newAttendance[name] = [];
    
                $allCheckboxes.each(function() {
                    newAttendance[name].push($(this).prop('checked'));
                });
            });
    
            handler(newAttendance);
        });
    }


}

class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.view.bindCheckEvent(this.handleCheckEvent);

        this.initialRender();
    }

    initialRender() {
        this.view.renderAttendance(this.model.getAttendance());
        this.view.renderMissing(this.model.getMissing());
    }

    handleCheckEvent = (newAttendance) => {
        this.model.setAttendance(newAttendance);
        this.view.renderMissing(this.model.getMissing());
    }
}

const app = new Controller(new Model(), new View());