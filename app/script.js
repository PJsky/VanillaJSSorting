var svg = document.getElementById('svgCanvas');
var newElement = document.createElementNS("http://www.w3.org/2000/svg", "rect")
let graph_data;

function bubble_sort(){
    let arrayOfNumbers = graph_data;
    let hasChangeHappened = false;
    let numberOfComparisons = arrayOfNumbers.length - 1;
    do {
        hasChangeHappened = false;
        for (var i=0; i < numberOfComparisons; i++){
            //Comparing of adjecant numbers
            if(arrayOfNumbers[i] > arrayOfNumbers[i+1]){
                //swap values of number array
                let tempValue = arrayOfNumbers[i];
                arrayOfNumbers[i] = arrayOfNumbers[i+1];
                arrayOfNumbers[i+1] = tempValue;
                
                //swap values of svg group array
                console.log("swap")
                swap_graph_bars(i,i+1);

                hasChangeHappened = true;
            }
        }
        numberOfComparisons--;
    }while(hasChangeHappened);
    console.log(arrayOfNumbers);
    
    return arrayOfNumbers;
}

//Takes array of all bars with their texts and swaps their transform attributes
function swap_graph_bars(bar_index1, bar_index2){
    let bars_array = document.querySelectorAll("g");
    //change transformations
    let temp_bar_trans = bars_array[bar_index1].getAttribute("transform");
    bars_array[bar_index1].setAttribute("transform", bars_array[bar_index2].getAttribute("transform"));
    bars_array[bar_index2].setAttribute("transform", temp_bar_trans);
    //change indexes
    bars_array[bar_index1].parentNode.insertBefore(bars_array[bar_index1], bars_array[bar_index2]);
    bars_array = document.querySelectorAll("g");
    bars_array[bar_index2].parentNode.insertBefore(bars_array[bar_index2], bars_array[bar_index1]);

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

    for(i=0;i<graph_data.length;i++){
        //Create bars based on data aquired
        let new_svg_group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        graphCanvas.appendChild(new_svg_group);
        let new_bar = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        new_svg_group.appendChild(new_bar);
        let new_text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        new_svg_group.appendChild(new_text);

        //Set bar attributes
        //offset = 20+(60*i); 
        //bar_translate_text = "translate(" + offset + ", 0)";
        //new_bar.setAttribute("transform", bar_translate_text);
        new_bar.setAttribute("y", 250-graph_data[i]);
        new_bar.setAttribute("width", 50);
        new_bar.setAttribute("height", graph_data[i]);
        new_bar.setAttribute("fill", "blue");

        //Set text
        new_text.textContent = graph_data[i];
        //Center text beneath the bar
        //offset = ((50-new_text.textLength.baseVal.value)/2) + 20+(60*i) ;
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
    console.log(list_of_graphs);

}

