var svg = document.getElementById('graph-canvas');
const stepSlider = document.querySelector(".progress-slider");
var newElement = document.createElementNS("http://www.w3.org/2000/svg", "rect")
let graph_data;
let graph_data_indexes = [];
let bars_array = [];
let step_counter;
let sorting_steps = [];
let current_step = 0;
let playInterval;
stepSlider.value = current_step;
let barToChange1, barToChange2;
let state_running;
let highlighted_instrution;


stepSlider.addEventListener("input", () =>{
    visualize_step_data(stepSlider.value);
    current_step=stepSlider.value;
})


function bubble_sort(){
    let hasChangeHappened = false;
    step_counter = 0;
    sorting_steps = [];
    let numberOfComparisons = graph_data.length - 1;
    sorting_steps.push({
        graph_data:[...graph_data],
        graph_data_indexes:[...graph_data_indexes],
        loop_iteration:-1,
        barsSorted: 0,
        isStepChange:false,
    });
    do {
        hasChangeHappened = false;
        for (var i=0; i < numberOfComparisons; i++){
            
           // let step_graph_data = [graph_data];
            step_counter++; // compare step
            let step={
                graph_data:[...graph_data],
                graph_data_indexes:[...graph_data_indexes],
                loop_iteration:i,
                barsSorted: graph_data.length-numberOfComparisons-1,
                isStepChange:false,
                stepNumber:step_counter
            }
            sorting_steps.push(step);
            
            //Comparing of adjecant numbers
            if(graph_data[i] > graph_data[i+1]){
                


                //swap values of number array
                let tempValue = graph_data[i];
                graph_data[i] = graph_data[i+1];
                graph_data[i+1] = tempValue;
                
                //swap values of svg group indexes
                swap_graph_bars(i,i+1);
                //update_data_visualization();
                

                hasChangeHappened = true;

                step_counter++; // swap step
                step={
                    graph_data:[...graph_data],
                    graph_data_indexes:[...graph_data_indexes],
                    loop_iteration:i,
                    barsSorted: graph_data.length-numberOfComparisons-1,
                    isStepChange:true,
                    stepNumber:step_counter
                }
                sorting_steps.push(step);
            }
        }
        
        numberOfComparisons--;

        step={
            graph_data:[...graph_data],
            graph_data_indexes:[...graph_data_indexes],
            loop_iteration:-1,
            barsSorted: graph_data.length-numberOfComparisons-1,
            isStepChange:true,
            stepNumber:step_counter
        }
        if(hasChangeHappened)
        sorting_steps.push(step);


    }while(hasChangeHappened);
    console.log(graph_data);

    sorting_steps.push({
        graph_data:[...graph_data],
        graph_data_indexes:[...graph_data_indexes],
        loop_iteration:-1,
        barsSorted: graph_data.length,
        isStepChange:false,
    });

    stepSlider.setAttribute("max", sorting_steps.length-1);


    return graph_data;
}

function play(){
    if(state_running==false){
        playInterval =  setInterval(next_step,500);
        state_running=true;    
    }
}
    
function stop(){
    clearInterval(playInterval);
    state_running = false
}

//Takes array of all bars with their texts and swaps their transform attributes
function swap_graph_bars(bar_index1, bar_index2){
    //change indexes
    let temp_graph_data_index = graph_data_indexes[bar_index1];
    graph_data_indexes[bar_index1] = graph_data_indexes[bar_index2];
    graph_data_indexes[bar_index2] = temp_graph_data_index;
}

function update_data_visualization(){
    bars_array = document.querySelectorAll("g");
    for(let i=0; i<bars_array.length; i++)
    bars_array[i].setAttribute("transform", `translate(${20+graph_data_indexes.indexOf(i)*60})`);
}

function visualize_step_data(step_number=-1){

    if(step_number==-1){
        let inputTextElement = document.querySelector("input#stepNumberInput");
        step_number = parseInt(inputTextElement.value);
        current_step = step_number;
        stepSlider.value = current_step;
    }

    bars_array = document.querySelectorAll("g");
    let step_graph_data = sorting_steps[step_number].graph_data;
    let step_graph_data_indexes = sorting_steps[step_number].graph_data_indexes;
    let step_graph_change_state = sorting_steps[step_number].isStepChange;
    let compareIndex = sorting_steps[step_number].loop_iteration;
    console.log(step_graph_data_indexes);
    //Put bars in proper places for a selected step of sorting
    for(let i=0; i<bars_array.length; i++){
        bars_array[i].setAttribute("transform", `translate(${20+step_graph_data_indexes.indexOf(i)*60})`);
        bars_array[i].querySelector("rect").setAttribute("fill", "blue");
    }
    // if(barToChange1){
    //     barToChange1.setAttribute("fill", "blue");
    //     barToChange2.setAttribute("fill", "blue");
    // }

        if(compareIndex>=0){
            let indexOfBarToChange1 = step_graph_data_indexes[compareIndex];
            let indexOfBarToChange2 = step_graph_data_indexes[compareIndex+1];
            barToChange1 = bars_array[indexOfBarToChange1].querySelector("rect");
            barToChange2 = bars_array[indexOfBarToChange2].querySelector("rect");
            barToChange1.setAttribute("fill", "red");
            barToChange2.setAttribute("fill", "red");
        }

    for(let i=0; i<sorting_steps[step_number].barsSorted;i++){
        let indexOfSortedBar = step_graph_data_indexes[step_graph_data_indexes.length-1-i];
        bars_array[indexOfSortedBar].querySelector("rect").setAttribute("fill","gold");
    }

    short_instrution = document.querySelector(".short-instruction");
    highlighted_instruction = document.querySelector(".highlight");
    if(highlighted_instrution)
    highlighted_instrution.classList.remove("highlight");

    if(sorting_steps[step_number].loop_iteration == -1){
        if(sorting_steps[step_number].barsSorted == sorting_steps[step_number].graph_data.length)
            {
                highlighted_instrution = document.querySelector(".end-instruction");
                short_instrution.textContent = "End"
            }
        else{
            highlighted_instrution = document.querySelector(".begin-instruction");
            short_instrution.textContent = "Begin iteration"
        }
    }else{
        if(sorting_steps[step_number].isStepChange){
            highlighted_instrution = document.querySelector(".switch-instruction");
            short_instrution.textContent = "Switch"
            }
        else{
            highlighted_instrution = document.querySelector(".compare-instruction");
            short_instrution.textContent = "Compare 2 elements"
            }
    }
    
    highlighted_instrution.classList.add("highlight");



}

function next_step(){
    current_step++
    stepSlider.value = current_step;
    visualize_step_data(current_step);
}

function prev_step(){
    current_step--
    stepSlider.value = current_step;
    visualize_step_data(current_step);
}

function color_compared_bars(index){
    bars_array = document.querySelector("g");
    first_bar_to_color = bars_array
}



//Takes array of numbers from text input and returns it
function read_data(){
    let inputTextElement = document.querySelector("input.graph-data")
    let data_as_string = inputTextElement.value;
    let data_string_array = data_as_string.replace(/ /g, '').split(',');
    let data_int_array = data_string_array.map(Number);
    if(data_int_array.includes(NaN))
        alert("Please input only numbers separated by ,")

    for(let i=0; i<data_int_array.length; i++)
        if(data_int_array[i]<=0){
            alert("Please input only positive numbers")
            return 0;
        }
    //console.log(data_int_array);
    return data_int_array;   
}

function create_graph(){
    let existing_chart_groups = document.querySelectorAll("g");
    for(i=0;i<existing_chart_groups.length;i++){
        existing_chart_groups[i].remove();
    }

    graph_data = read_data();
    console.log(graph_data);
    if(graph_data == 0)
        return 0;
        
    let graphCanvas = document.querySelector("svg")
    graph_data_indexes = [];

    for(i=0;i<graph_data.length;i++){
        //Create table of vector graphic group indexes
        graph_data_indexes.push(i);
        //Create bars based on data aquired
        let new_svg_group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        graphCanvas.appendChild(new_svg_group);
        let new_bar = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        new_svg_group.appendChild(new_bar);
        let new_text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        new_svg_group.appendChild(new_text);

        //Set bar attributes

        new_bar.setAttribute("y", 250-graph_data[i]);
        new_bar.setAttribute("width", 50);
        new_bar.setAttribute("height", graph_data[i]);
        new_bar.setAttribute("fill", "blue");

        //Set text
        new_text.textContent = graph_data[i];
        //Center text beneath the bar
        offset = ((50-new_text.textLength.baseVal.value)/2);
        text_with_offset = "translate(" + offset + ", 0)";
        new_text.setAttribute("transform",text_with_offset);
        new_text.setAttribute("y", 270);

        //Move group to a corret place in chart
        offset = 20+(60*i);
        translation_attribute = "translate(" + offset + ", 0)";
        new_svg_group.setAttribute("transform", translation_attribute);
    }
    
    let list_of_graphs = graphCanvas.querySelectorAll("g")
    bars_array = document.querySelectorAll("g");
    console.log(list_of_graphs);

    //bubble sort after creating graph
    bubble_sort();
}

