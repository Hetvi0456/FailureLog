const Failure = require('../models/Failure');

// @desc    Create a new failure entry
// @route   POST /api/failures
// @access  Private
const createFailure = async (req, res) => {
  try {
    const {
      title,
      errorMessage,
      project,
      technology,
      category,
      environment,
      rootCause,
      solution,
      status,
      attempts
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const failureStatus = status || 'open';
    const resolvedAt = failureStatus === 'resolved' ? new Date() : undefined;

    const failure = await Failure.create({
      user: req.user._id,
      title: title.trim(),
      errorMessage: errorMessage || '',
      project: project || '',
      technology: technology || '',
      category: category || '',
      environment: environment || '',
      rootCause: rootCause || '',
      solution: solution || '',
      status: failureStatus,
      attempts: attempts || [],
      createdAt: new Date(),
      updatedAt: new Date(),
      resolvedAt
    });

    res.status(201).json(failure);
  } catch (error) {
    console.error('Create failure error:', error);
    res.status(500).json({ message: 'Server error creating failure' });
  }
};

// @desc    Get all failures for logged-in user with optional search & filters
// @route   GET /api/failures
// @access  Private
const getFailures = async (req, res) => {
  try {
    const { search, status, project, technology, category } = req.query;

    const query = { user: req.user._id };

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { errorMessage: searchRegex },
        { project: searchRegex },
        { technology: searchRegex }
      ];
    }

    if (status && status.trim()) {
      query.status = status.trim();
    }

    if (project && project.trim()) {
      query.project = new RegExp(`^${project.trim()}$`, 'i');
    }

    if (technology && technology.trim()) {
      query.technology = new RegExp(technology.trim(), 'i');
    }

    if (category && category.trim()) {
      query.category = new RegExp(`^${category.trim()}$`, 'i');
    }

    const failures = await Failure.find(query).sort({ createdAt: -1 });
    res.status(200).json(failures);
  } catch (error) {
    console.error('Get failures error:', error);
    res.status(500).json({ message: 'Server error fetching failures' });
  }
};

// @desc    Get single failure by ID
// @route   GET /api/failures/:id
// @access  Private
const getFailureById = async (req, res) => {
  try {
    const failure = await Failure.findOne({ _id: req.params.id, user: req.user._id });
    if (!failure) {
      return res.status(404).json({ message: 'Failure entry not found' });
    }
    res.status(200).json(failure);
  } catch (error) {
    console.error('Get failure by ID error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Invalid failure ID format' });
    }
    res.status(500).json({ message: 'Server error fetching failure details' });
  }
};

// @desc    Update a failure entry
// @route   PUT /api/failures/:id
// @access  Private
const updateFailure = async (req, res) => {
  try {
    const failure = await Failure.findOne({ _id: req.params.id, user: req.user._id });
    if (!failure) {
      return res.status(404).json({ message: 'Failure entry not found' });
    }

    const {
      title,
      errorMessage,
      project,
      technology,
      category,
      environment,
      rootCause,
      solution,
      status
    } = req.body;

    if (title !== undefined) failure.title = title.trim();
    if (errorMessage !== undefined) failure.errorMessage = errorMessage;
    if (project !== undefined) failure.project = project;
    if (technology !== undefined) failure.technology = technology;
    if (category !== undefined) failure.category = category;
    if (environment !== undefined) failure.environment = environment;
    if (rootCause !== undefined) failure.rootCause = rootCause;
    if (solution !== undefined) failure.solution = solution;

    if (status !== undefined && status !== failure.status) {
      failure.status = status;
      if (status === 'resolved' && !failure.resolvedAt) {
        failure.resolvedAt = new Date();
      } else if (status !== 'resolved') {
        failure.resolvedAt = undefined;
      }
    }

    failure.updatedAt = new Date();

    const updatedFailure = await failure.save();
    res.status(200).json(updatedFailure);
  } catch (error) {
    console.error('Update failure error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Invalid failure ID format' });
    }
    res.status(500).json({ message: 'Server error updating failure' });
  }
};

// @desc    Delete a failure entry
// @route   DELETE /api/failures/:id
// @access  Private
const deleteFailure = async (req, res) => {
  try {
    const failure = await Failure.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!failure) {
      return res.status(404).json({ message: 'Failure entry not found' });
    }
    res.status(200).json({ message: 'Failure entry deleted successfully' });
  } catch (error) {
    console.error('Delete failure error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Invalid failure ID format' });
    }
    res.status(500).json({ message: 'Server error deleting failure' });
  }
};

// @desc    Add a debugging attempt to a failure
// @route   POST /api/failures/:id/attempts
// @access  Private
const addAttempt = async (req, res) => {
  try {
    const failure = await Failure.findOne({ _id: req.params.id, user: req.user._id });
    if (!failure) {
      return res.status(404).json({ message: 'Failure entry not found' });
    }

    const { action, result, notes } = req.body;

    if (!action || !action.trim()) {
      return res.status(400).json({ message: 'Attempt action is required' });
    }
    if (!result || !result.trim()) {
      return res.status(400).json({ message: 'Attempt result is required' });
    }

    const newAttempt = {
      action: action.trim(),
      result: result.trim(),
      notes: notes ? notes.trim() : '',
      timestamp: new Date()
    };

    failure.attempts.push(newAttempt);
    failure.updatedAt = new Date();

    const updatedFailure = await failure.save();
    res.status(200).json(updatedFailure);
  } catch (error) {
    console.error('Add attempt error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Invalid failure ID format' });
    }
    res.status(500).json({ message: 'Server error adding debugging attempt' });
  }
};

module.exports = {
  createFailure,
  getFailures,
  getFailureById,
  updateFailure,
  deleteFailure,
  addAttempt
};
