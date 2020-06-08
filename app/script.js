var svg = document.getElementById('svgCanvas');
var newElement = document.createElementNS("http://www.w3.org/2000/svg", "rect")
let graph_data;
let graph_data_indexes = [];
let bars_array = [];
let step_counter;
let sorting_steps = [];

function bubble_sort(){
    let hasChangeHappened = false;
    step_counter = 0;
    let numberOfComparisons = graph_data.length - 1;
    do {
        hasChangeHappened = false;
        for (var i=0; i < numberOfComparisons; i++){
            
           // let step_graph_data = [graph_data];
            step_counter++; // compare step
            let step={
                graph_data:[...graph_data],
                graph_data_indexes:[...graph_data_indexes],
                loop_iteration:i,
                numberOfComparisons:numberOfComparisons,
                hasChangeHappened:hasChangeHappened,
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
                update_data_visualization();
                

                hasChangeHappened = true;

                step_counter++; // swap step
                step={
                    graph_data:[...graph_data],
                    graph_data_indexes:[...graph_data_indexes],
                    loop_iteration:i,
                    numberOfComparisons:numberOfComparisons,
                    hasChangeHappened:hasChangeHappened,
                    isStepChange:true,
                    stepNumber:step_counter
                }
                sorting_steps.push(step);
            }
        }
        numberOfComparisons--;
    }while(hasChangeHappened);
    console.log(graph_data);
    
    return graph_data;
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

function swap1and2(){
    let g = document.querySelectorAll("g");
    tempGTransform = g[0].getAttribute("transform");
    g[0].setAttribute("transform", g[1].getAttribute("transform"));
    g[1].setAttribute("transform", tempGTransform);


}



//Takes array of numbers from text input and returns it
function read_data(){
    let inputTextElement = document.querySelector("input#initializationData")
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

}

