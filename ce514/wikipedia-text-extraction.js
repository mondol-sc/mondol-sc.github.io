async function extractWikipediaText(articleTitle) {
    try {
        // Build the API access URL for the Wikipedia 
        // // the origin parameter enable CORS and avoid corresponding error
        const accessURL = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(articleTitle)}&prop=extracts&format=json&origin=*`; 
        
        // Fetch the data response from the Wikipedia API
        const response = await fetch(accessURL);
        if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
        };

        // Obtain the json data from the fetched response
        const json_data = await response.json();

        // Extract the pages in the json data
        const pages = json_data.query.pages;
        if (!pages) {
        throw new Error(`No page found for title: ${articleTitle}`);
        };

        // Get the page ID of the first page and the corresponding content
        const pageId = Object.keys(pages)[0];      
        const content = pages[pageId].extract;
        if (!content) {
            throw new Error("No content found for this page.");
        };

        // Limit the text content within the first paragraph only
        const firstParagraph = content.split('<h2')[0].trim();


        // Process the text content to bring into a cleaned format
        const cleanedText = cleanExtractedText(firstParagraph); 
        return cleanedText;
    }
        // Show the error in the console and HTML if the trial fails
        catch (error) {
        const errorText = "Sorry! We are not being able to show you the wiki since the API request wasn't successful: " + error
        console.error(errorText);
        return errorText;
    };
    };
  


  function cleanExtractedText(textContent) {
      // Remove HTML tags using regular expression
      let cleanText = textContent.replace(/<[^>]*>/g, "");

      // Corresponding characters for common HTML character entities
      const entities = {
        '&nbsp;': ' ',
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#039;': "'",
        '&#39;': "'"
      };
  
      // Convert HTML character entities 
      cleanText = cleanText.replace(/&[a-z]+;|&#\d+;/g, match => entities[match] || match);  
      return cleanText;
  }
  
 async function displayWikipediaText(title) {
    const text = await extractWikipediaText(title);
    if (text) {
      // Display the text with the HTML
      const outputElement = document.getElementById("wiki"); 
      if (outputElement) {
        outputElement.textContent = text; 
        if (!text.includes('Error')) {
            const sourceURL = 'https://en.wikipedia.org/wiki/' + title;
            document.getElementById("wikiSource").innerHTML = `<p>Source: <a href="${sourceURL}" target="_blank">Wikipedia</a></p>`;
        }
        
      } else {
          console.log(text); 
      }
    }
  }
  
  // Default call
displayWikipediaText("Bangladesh"); 
