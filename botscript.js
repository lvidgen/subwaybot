	(function(){
	
	var quests = [{
	  label: "bread",
	  intro: "Please choose which type of bread you'd like. We have ",
	  opts: ['Honey Oat', 'Italian Herbs & Cheese', 'Wheat', 'Multigrain', 'White', 'Flatbread', 'Wrap'],
	  out: ""
	}, {
	  label: "fill",
	  intro: "And what sort of filling do you feel like today? You can choose from ",
	  opts: ["ham", "chicken", "beef", "turkey", "vegetable"],
	  out: ""
	}, {
	  label: "ham",
	  intro: "Our ham and bacon options include",
	  opts: ["Ham", "Turkey & Ham", "Subway Club", "Pizza Sub with Cheese", "Italian B.M.T.", "Chicken Parmigiana Melt", "Chicken & Bacon Ranch Melt"],
	  out: " which would you like?"
	}, {
	  label: "chick",
	  intro: "Our Chicken options include",
	  opts: ["Subway Club", "Chicken Teriyaki", "Oven Roasted Chicken Sub", "Chicken Strips", "Chicken Classic", "Subway Melt", "Chicken Schnitzel", "Chicken Parmigiana Melt", "Chicken & Bacon Ranch Melt"],
	  out: " which would you like?"
	}, {
	  label: "beef",
	  intro: "Our beef options include",
	  opts: ["Roast Beef", "Meatball", "Steak & Cheese"],
	  out: " which would you like?"
	}, {
	  label: "turk",
	  intro: "Our turkey options include",
	  opts: ["Turkey", "Turkey & Ham"],
	  out: " which would you like?"
	}, {
	  label: "veg",
	  intro: "Our vegetarian options include",
	  opts: ["Veggie Delite", "Veggie Patty"],
	  out: " which would you like?"
	}, {
	  label: "salad",
	  intro: "Here are the salad options. You can choose as many as you like",
	  opts: ["Spinach", "Capsicum", "Carrot", "Cucumber", "Jalapenos", "Lettuce", "Olives", "Pickles", "Tomato", "Avocado", "Onion"],
	  out: ""
	}, {
	  label: "cheese",
	  intro: "Please say which type of cheese you'd like. The options are ",
	  opts: ["Cheddar", "Old English", "Natural Swiss", "Mozzarella"],
	  out: ""
	}, {
	  label: "sauce",
	  intro: "Please choose your sauce. We have ",
	  opts: ["Aioli", "BBQ", "Chipotle", "Honey Mustard", "Marinara", "Mayo", "Ranch", "Sweet Chilli", "Sweet Onion", "Thousand Island", "Tomato", "Hot Chilli"],
	  out: " which would you like?"
	}, {
	  label: "drink",
	  intro: "How about Something to drink? I can get you ",
	  opts: ["Coke", "Coke Zero", "Diet Coke", "Water", "Nothing"],
	  out: ""
	}, {
	  label: "sweet",
	  intro: "And would you like something sweet with your order? We have ",
	  opts: ["Choc Chip", "Double Choc Chip", "Raspberry Cheesecake", "White Chip Macadamia", "Nothing"],
	  out: ""
	}];

	var arr, idx = 0,sub = {},
	  greeting = "Hello. I am your Subway sandwichbot. I'll be taking your order today.";

	var recognition = new webkitSpeechRecognition();
	recognition.maxAlternatives = 1;
	recognition.lang = 'en';

	var su = new SpeechSynthesisUtterance();

	su.text = greeting;
	su.lang = "en";
	su.pitch = 1;
	su.rate = 0.9;

document.getElementById("start").onclick=function(){
	speechSynthesis.speak(su);
	su.onend = giveOpts;
}

	function giveOpts() {
	  var str = quests[idx].intro + " ",
	    arr = quests[idx].opts,
	    end = arr.pop();

	  str += arr.join(", ") + " oar " + end; // because robots can't say 'or' apparently
	  su.text = str + quests[idx].out;
	  speechSynthesis.speak(su);
	  su.onend = listenUp;
	}

	function listenUp() {
	  recognition.start();
	  recognition.onresult = function(event) {
	    if (typeof(event.results) === 'undefined') { //What's that you say? Dunno if this works as expected...
	      recognition.stop();
	      giveOpts();
	    }

	    for (var i = event.resultIndex; i < event.results.length; ++i) {
	      if (event.results[i].isFinal) {
	        var val = event.results[i][0].transcript.toLowerCase();
	        switch (idx) {
	          case 1:
	            idx = quests[1].opts.indexOf(val) + 2;   //worth more thought - will break if array changed
	            giveOpts();
	            idx = 6;
	            break;
	          default:
	            var label = idx === 6 ? "fill" : quests[idx].label;
	            sub[label] = val;
	            idx++;
	            if (idx < quests.length) {
	              giveOpts();
	            }
	            if (idx === quests.length) {
	              readOrder();
	            }
	        }
	        break;
	      }
	    }
	  };

	}

	function readOrder() {
	  var dr = sub.drink === "nothing" ? "" : " with a " + sub.drink + " to drink";
	  var sw = sub.sweet === "nothing" ? "" : " and a " + sub.sweet + " to finish.";
	  var finalord = "So that's a " + sub.fill + " on " + sub.bread + " with " + sub.salad + " and " + sub.sauce + dr + sw;
	  su.text = finalord;
	  speechSynthesis.speak(su);
	}
})();	
