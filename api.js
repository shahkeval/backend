
app.get('/allAdmin', async (req, res) => {
  console.log("deployed");
  try {
    const response = await UserModelAdmin.find({});
    res.status(200).send(response);
  } catch (error) {
    console.log('Error while insert order', error);
  }
});
