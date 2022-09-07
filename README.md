# Immutascan vs Cryotoslam

## In this project 
In this project we have two sections:
1. data scraping
2. webapp/frontend

## Data Scraping
To generate new data to be used in the frontend:
1. Navigate to the folder ./data-scraping/scripts
2. Run two commands:
    - ``` node scrape-immutascan-collection-data.js```
    - ``` python scrape-cryptoslam-immutascan.py```
3. Find the files under the folder ./data-scraping/output-data
4. Delete the data in the frontend, and replace with the files from output data.
Note: there is some light data cleaning that needs to be added into the scripts to make this perfect! Including wrapping files in arrays etc.

## Frontend 
Find the live site here netlify-imx-ge-nivaaz.netlify.app
## Deploys
- There is automated deploys set up on netlify for each push to the 'main' branch.
## Development
- To run the project locally, navigate to webapp/imx-ge-app
- Install any dependencies
- and run ``` npx next dev ```

## Potential extentions:
### Data:
- update the firebase file to upload the new data files, and fetch these in the frontend.
- set up a worker in the cloud using the two script file and the firebase script to auto generate new files every hour, and update them in the firebase database.
### UX:
- While this data is not the best to show visually using charts, it could be interesting to see what the differences/change look like between cryposlam and immutascan across collections & the IMX blockchain over time. e.g. every day for a month at 1:30pm AEST.


## Notes:
- To store the data we have used json files. Since this is a preliminary experiement, it's often better to go with a lighterweight approach that allows for easy flexibility i.e. json file rather than a database. 
    - With a database:
        - if we decide to change the structure of data, there may be added time to run migrations and run integration tests.
        - I would recommend adding a database in the next phase after we get feedback from the team
    - With JSON:
        - We can easily adjust file formats, names etc in our scripts without having to run migrations. 
- We don't know what time both cryptoslam and immutascan take snapshots at to compute their data - this could be one of the features that creates a difference between data points, and will lead to differences in 24h. 