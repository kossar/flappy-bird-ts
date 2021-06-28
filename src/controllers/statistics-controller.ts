import GameBrain from "../model/gamebrain";
import GameScore from "../model/gamescore";

export default class StatisticsController{
    private model: GameBrain;
    private viewContainer: HTMLElement;

    constructor(model: GameBrain, viewContainer: HTMLElement){
        this.viewContainer = viewContainer;
        this.model = model;
    }

    public run(): void{
        console.log('run: ' + this.model);
        this.viewContainer.innerHTML = '';
        this.viewContainer.append(this.gamePlayerDataContainer(this.model.getCurrentPlayerData().name));
        this.viewContainer.append(this.nameInputContainer(this.model.getCurrentPlayerData().name));
        this.viewContainer.append(this.infoContainer());
        this.viewContainer.append(this.statsListContainer(this.model.getScoreBoard()));
        this.viewContainer.style.paddingTop = '50px'; // TODO: should change this value to dynamic
        console.log('stats');
    }

    public stop(): void{
        this.viewContainer.style.paddingTop = '';
    }

    public refreshData(){
        this.run();
    }
    private nameInputContainer(currentName: string): HTMLDivElement{
        let nameInputContainer: HTMLDivElement = document.createElement('div');
        nameInputContainer.classList.add('container', 'input');

        let inputHeader: HTMLHeadingElement = document.createElement('h4');
        inputHeader.innerText = 'Add your name or use default "Player"';
        nameInputContainer.append(inputHeader);

        let form: HTMLFormElement = document.createElement('form');
        form.id = 'form';
        let nameInput: HTMLInputElement = document.createElement('input');
        nameInput.id = 'name';
        nameInput.type = 'text';
        nameInput.name = 'player';
        nameInput.placeholder = currentName;
        form.append(nameInput);

        let submitButton: HTMLInputElement = document.createElement('input');
        submitButton.value = 'Submit';
        submitButton.type = 'submit';
        submitButton.id = 'submit';
        
        form.append(submitButton);

        nameInputContainer.append(form);
        return nameInputContainer;
    }


    
    
    private statsListContainer(scoreBoard: GameScore[]): HTMLDivElement {
        let statsContainer = document.createElement('div');
        statsContainer.classList.add('container', 'stats');

        let statsHeader: HTMLHeadingElement = document.createElement('h4');
        statsHeader.innerText = 'Top scores';

        let statsTable: HTMLTableElement = document.createElement('table');

        for (let index = 0; index < scoreBoard.length; index++) {
            let statsRow: HTMLTableRowElement = document.createElement('tr');
            let posCol: HTMLTableDataCellElement = document.createElement('td');
            let nameCol: HTMLTableDataCellElement = document.createElement('td');
            let pointsCol: HTMLTableDataCellElement = document.createElement('td');

            posCol.innerHTML = (index + 1).toString();
            nameCol.innerHTML = scoreBoard[index].name;
            pointsCol.innerHTML = scoreBoard[index].score.toString();
            statsRow.append(posCol);
            statsRow.append(nameCol);
            statsRow.append(pointsCol);

            statsTable.append(statsRow);
            
        }
        
        statsContainer.append(statsHeader);
        statsContainer.append(statsTable);
        return statsContainer;

    }

    private infoContainer(): HTMLDivElement{
        let infoContainer: HTMLDivElement = document.createElement('div');
        infoContainer.classList.add('container', 'info');
        let info: HTMLParagraphElement = document.createElement('p');
        info.innerHTML = "On desktop press <span class='bold'> space </span> to jump, on touchscreen <span class='bold'>tap</span>";
        infoContainer.append(info);
        return infoContainer;

        
    }

    private gamePlayerDataContainer(name: string): HTMLDivElement {
        let dataContainer: HTMLDivElement = document.createElement('div');
        dataContainer.classList.add('game-player-container');
    
        let nameContainer: HTMLParagraphElement = document.createElement('p');
        nameContainer.id = 'player-name-stats';
        nameContainer.innerHTML = 'Current player: <span id="#current-player"> ' + name + '</span>';
        dataContainer.append(nameContainer);
    
    
        return dataContainer;
    }
    
}