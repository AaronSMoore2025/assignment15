const getCrafts = async() => {
    const url = "http://localhost:3000/api/crafts";

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
    img.src = "http://localhost:3000/images/" + craft.image;
    mainSection.append(img);

    mainSection.onclick = (e) => {
        console.log("i am in onclick");
        document.getElementById("dialog-2").style.display = "block";

        const details = document.getElementById("dialog-details-2");
        details.innerHTML = "";
        const imageDetails = document.getElementById("dialog-img-2");
        imageDetails.innerHTML = "";

        const myImage = document.createElement("img");
        myImage.src = "";
        myImage.src = "http://localhost:3000/images/" + craft.image;
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
    };

    document.getElementById("dialog-close-2").onclick = () => {
        document.getElementById("dialog-2").style.display = "none";
    };

    document.getElementById("dialog-close").onclick = () => {
        document.getElementById("dialog").style.display = "none";
    };

    return mainSection;
};

const addCraft = async (e) => {
    e.preventDefault();
    const form = document.getElementById("add-craft-form");
    const formData = new FormData(form);
    let response;
    //formData.append("crafts", getCrafts());
    formData.append("supplies", getSupplies());

    console.log(...formData);

    response = await fetch("/api/crafts", {
        method: "POST",
        body: formData,
    });

    if (response.status != 200) {
        console.log("Error posting data");
    }

    await response.json();
    resetForm();
    document.getElementById("dialog").style.display = "none";
    showCrafts();
}

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