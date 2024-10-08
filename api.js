
app.get('/allAdmin', async (req, res) => {
  console.log("deployed");
  try {
    const response = await UserModelAdmin.find({});
    res.status(200).send(response);
  } catch (error) {
    console.log('Error while insert order', error);
  }
});
app.post('/Admin',async (req, res) => {
  const existingUser = await UserModelAdmin.findOne({ id: req.body.id });
    if (existingUser) {
      return res.status(400).json({ error: 'User ID is not available' });
    }
    UserModelAdmin.create(req.body)
    .then(users => res.json(users))
    .catch(err => res.json(err));
});
