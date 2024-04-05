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
    const crafts = await getCrafts();
    
    crafts.forEach((craft) => {
        const section = getCraftSection(craft);
        document.getElementById("json-info").append(section);
    });
    
    //let menu = document.getElementById("json-info");
    /*
    for(let i = 0; i < crafts.length; i++){
        menu.children.item(i % 4).append(getCraftImage(crafts[i]));
    }
    */
};

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

        eLink.onclick = showCraftForm;
        dLink.onclick = deleteCraft.bind(this, craft);

        populateEditForm(craft);
    };

    document.getElementById("dialog-close-2").onclick = () => {
        document.getElementById("dialog-2").style.display = "none";
    };

    document.getElementById("dialog-close").onclick = () => {
        document.getElementById("dialog").style.display = "none";
    };
    /*
    const spoon = document.createElement("section");
    spoon.classList.add("spoon");
    mainSection.append(spoon);
    eLink.onclick = showCraftForm;
    //dLink.onclick = 
    */

    //populateEditForm(craft);

    return mainSection;
};

const populateEditForm = (craft) => {
    const form = document.getElementById("add-craft-form");
    form._id.value = craft._id;
    form.name.value = craft.name;
    form.description.value = craft.description;
    document.getElementById("img-prev").src = craft.img;
    populateSupplies(craft.supplies);
}

const populateSupplies = (supplies) => {
    
    const section = document.getElementById("supply-boxes");
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
    showRecipes();
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