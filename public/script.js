const getCrafts = async() => {
    const url = "/api/crafts";

    try {
        const response = await fetch(url);
        return response.json();
    } catch(error) {
        console.log(error);
    }
};

const showCrafts = async() => {

    let crafts = await getCrafts();
    let craftsDiv = document.getElementById("craft-list");
    //craftsDiv.innerHTML = "";
    crafts.forEach((craft) => {
        const mainSection = document.createElement("section");
        mainSection.id = "mainSection";
        
        const myImage = document.createElement("img");
        myImage.src = "/images/" + craft.image;
        mainSection.append(myImage);

        document.getElementById("craft-list").append(mainSection);
        


        mainSection.onclick = (e) => {
            e.preventDefault();
            displayDetails(craft);
        };

        
    });
    //const crafts = await getCrafts();
    //const mainSection = document.createElement("section");
    //let mainPage = document.getElementById("json-info");
    //mainPage.innerHTML = "";

    //crafts.forEach((craft) => {

        //const section = getCraftSection(craft);
        //displayDetails(craft);
        //document.getElementById("json-info").append(section);
    //});
    
    
};

const displayDetails = (craft) => {
    openDialog("craft-details");
    const craftDetails = document.getElementById("craft-details");
    craftDetails.innerHTML = "";
    craftDetails.classList.remove("hidden");

    const dLink = document.createElement("a");
    dLink.innerHTML = "	&#9249;";
    craftDetails.append(dLink);
    dLink.id = "delete-link";

    const eLink = document.createElement("a");
    eLink.innerHTML = "&#9998;";
    craftDetails.append(eLink);
    eLink.id = "edit-link";

    const h2 = document.createElement("h2");
    h2.innerHTML = craft.name;
    craftDetails.append(h2);
    console.log(h2);

    const myImage = document.createElement("img");
    myImage.src = "/images/" + craft.image;
    craftDetails.append(myImage);

    const p = document.createElement("p");
    p.innerHTML = "Description: " + craft.description;
    craftDetails.append(p);

    const p2 = document.createElement("p");
    p2.innerHTML = "Supplies: " + craft.supplies;
    craftDetails.append(p2);

    const spoon = document.createElement("section");
    spoon.classList.add("spoon");
    craftDetails.append(spoon);

    

    document.getElementById("dialog-details").append(craftDetails);


    document.getElementById("dialog-close").onclick = () => {
        document.getElementById("dialog").style.display = "none";
    };

    eLink.onclick = showCraftForm;
    dLink.onclick = deleteCraft.bind(this, craft);
    populateEditForm(craft);

};

/*
const getCraftSection = (craft) => {
    const mainSection = document.createElement("section");
    mainSection.id = "mainSection";
    const img = document.createElement("img");
    img.src = "/images/" + craft.image;
    mainSection.append(img);

    mainSection.onclick = (e) => {
        console.log("i am in onclick");
        document.getElementById("dialog-2").style.display = "block";

        const details = document.getElementById("dialog-details-2");
        details.innerHTML = "";
        const imageDetails = document.getElementById("dialog-img-2");
        imageDetails.innerHTML = "";

        const dLink = document.createElement("a");
        dLink.innerHTML = "	&#9249;";
        imageDetails.append(dLink);
        dLink.id = "delete-link";
        
        const eLink = document.createElement("a");
        eLink.innerHTML = "&#9998;";
        imageDetails.append(eLink);
        eLink.id = "edit-link";

        const myImage = document.createElement("img");
        myImage.src = "";
        myImage.src = "/images/" + craft.image;
        myImage.id = "myImage";
        imageDetails.append(myImage);

        const myName = document.createElement("h1");
        myName.innerHTML = craft.name;
        details.append(myName);

        const myDescription = document.createElement("p");
        myDescription.innerHTML = "Description: " + craft.description;
        details.append(myDescription);

        const mySupplies = document.createElement("p");
        mySupplies.innerHTML = "Supplies: " + craft.supplies;
        details.append(mySupplies);

        const spoon = document.createElement("section");
        spoon.classList.add("spoon");
        mainSection.append(spoon);

        eLink.onclick = (e) => {
            e.preventDefault();
            openDialog("add-craft-form");
            populateEditForm(craft);
        };


        dLink.onclick = deleteCraft.bind(this, craft);

        
    };

    document.getElementById("dialog-close-2").onclick = () => {
        document.getElementById("dialog-2").style.display = "none";
    };

    document.getElementById("dialog-close").onclick = () => {
        document.getElementById("dialog").style.display = "none";
    };

    
    const spoon = document.createElement("section");
    spoon.classList.add("spoon");
    mainSection.append(spoon);
    eLink.onclick = showCraftForm;
    //dLink.onclick = 
    

    //populateEditForm(craft);

    return mainSection;
};
*/


const populateEditForm = (craft) => {
    const form = document.getElementById("add-craft-form");
    form._id.value = craft._id;
    form.name.value = craft.name;
    form.description.value = craft.description;
    document.getElementById("img-prev").src = "/images/" + craft.image;
    populateSupplies(craft.supplies);
}

const populateSupplies = (supplies) => {
    
    const section = document.getElementById("supply-boxes");
    section.innerHTML = "";
    supplies.forEach((supply)=>{
        const input = document.createElement("input");
        input.type = "text";
        input.value = supply;
        section.append(input);
    });
    
};



const addCraft = async (e) => {
    e.preventDefault();
    const form = document.getElementById("add-craft-form");
    const formData = new FormData(form);
    let response;
    //formData.append("crafts", getCrafts());
    formData.append("supplies", getSupplies());

    console.log(...formData);

    //need an if statement to change it to a put instead of a post
    if (form._id.value.trim == "") {
        console.log("in post");
        response = await fetch("/api/crafts", {
            method: "POST",
            body: formData,
        });
    } else {
        console.log("in put");
        response = await fetch(`/api/crafts/${form._id.value}`,{
            method: "PUT",
            body: formData,
        });
    }
    /*
    response = await fetch("/api/crafts", {
        method: "POST",
        body: formData,
    });
    */

    if (response.status != 200) {
        console.log("Error posting data");
    }

    await response.json();
    resetForm();
    document.getElementById("dialog").style.display = "none";
    showCrafts();
}

const deleteCraft = async(craft) =>{
    let response = await fetch(`/api/crafts/${craft._id}`,{
      method:"DELETE",
      headers:{
        "Content-Type":"application/json;charset=utf-8",
      },
    });
  
    if(response.status!= 200){
      console.log("Error deleting");
      return;
    }
  
    let result = await response.json();
    resetForm();
    showCrafts();
    document.getElementById("dialog").style.display = "none";
};

const getSupplies = () => {
    const inputs = document.querySelectorAll("#supply-boxes input");
    let supplies = [];

    inputs.forEach((input) => {
        supplies.push(input.value);
    });

    return supplies;
}

const resetForm = () => {
    const form = document.getElementById("add-craft-form");
    form.reset();
    document.getElementById("supply-boxes").innerHTML = "";
    document.getElementById("img-prev").src = "";
};

const showCraftForm = (e) => {
    //console.log("I am in show craft Form");
    e.preventDefault();
    openDialog("add-craft-form");
    resetForm();
}

const addSupplies = (e) => {
    e.preventDefault();
    const section = document.getElementById("supply-boxes");
    const input = document.createElement("input");
    input.type = "text";
    section.append(input);
}

const openDialog = (id) => {
    document.getElementById("dialog").style.display = "block";
    document.querySelectorAll("#dialog-details > *").forEach((item) => {
        item.classList.add("hidden");
    });
    document.getElementById(id).classList.remove("hidden");
}

showCrafts();
document.getElementById("add-craft-form").onsubmit = addCraft;
document.getElementById("add-link").onclick = showCraftForm;
document.getElementById("add-supply").onclick = addSupplies;

document.getElementById("img").onchange = (e) => {
    if (!e.target.files.length) {
        document.getElementById("img-prev").src = "";
        return;
    }
    document.getElementById("img-prev").src = URL.createObjectURL(
        e.target.files.item(0)
    );
};