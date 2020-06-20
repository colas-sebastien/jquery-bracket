infos={};

function sauver(data) {
    infos=data;
    affiche_tournoi();
}

function enregistrer() {
    $.ajax({
        async:true,
        type:"POST",
        url:"/php/enregistre.php",
        data:JSON.stringify(infos),
        datatype:"json",
        success: function(){alert("Enregistrement réussi");},
        error: function(){alert("Impossible d'enregistrer");}
    });
}



function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function tirage_aleatoire()
{
    if (infos.results.length !== 0) return;
    var participants=liste_participants();  
    participants=shuffle(participants);    
    
    var retour=[];
    var nb_matchs=infos.teams.length;

    for (i=0;i<nb_matchs;i++)
    {
        if(participants[i+nb_matchs]) {
            retour.push([participants[i],participants[i+nb_matchs]]);
        } else {
            retour.push([participants[i],null]);
        }            
    }
    infos.teams=retour;
    affiche_tournoi();  
}

function liste_participants() {
    return infos.teams.flat().filter(function (el) {
            return el !== null;
        });
}

function ajoute_participant() {
    if ((infos.results.length !== 0) || ($("#participant").val()==="")) return;
    if (infos.teams.length===0) {
        infos.teams.push([$("#participant").val(),null]);
    } else {
        var participants=liste_participants();

        participants.push($("#participant").val());
        var racine_2=Math.ceil(Math.log2(participants.length));

        var complement=Math.pow(2,racine_2)-participants.length;
        for (i=0;i<complement;i++) {
            participants.push(null);
        }

        var retour=[];
        for (i=0;i<participants.length;i=i+2) {
            retour.push([participants[i],participants[i+1]]);
        }

        infos.teams=retour;
    }
    affiche_tournoi();
    $("#participant").val("");
}


function vider() {
    infos={"teams":[], "results":[]};
    affiche_tournoi();
}

function edit_fn(container, data, doneCb) { }
function render_fn(container, data, score, state) {
  switch(state) {
    case "empty-bye":
      return;
    case "empty-tbd":
      container.append("à déterminer");
      return;
    case "entry-no-score":
    case "entry-default-win":
    case "entry-complete":
      container.append(data);
      return;
  }
}

function affiche_tournoi()
{
    fr={"1st":"1er",
        "2nd":"2nd",
        "3rd":"3e",
        "4th":"4e"};
    
    $('#tournoi').bracket(
        {   teamWidth: 90,            
            disableToolbar:true, 
            disableTeamEdit:true, 
            centerConnectors:true,
            init: infos,
            save:sauver ,
            decorator: {edit: edit_fn, render: render_fn}
        });        
        
    $(".bubble").each(function(index,element){
        $(element).html(fr[$(element).html()]);
    });
}

$(document).ready(function(){  
    $.ajaxSetup({ cache: false });
    $.getJSON( "js/resultats.json", function( data ) {
        infos=data;
        affiche_tournoi();
    });
    
    $("#ajouter").click(ajoute_participant);
    $("#aleatoire").click(tirage_aleatoire);    
    $("#enregistrer").click(enregistrer);        
    $("#vider").click(vider);
});
