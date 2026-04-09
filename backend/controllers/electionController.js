const prisma = require('../config/prisma');

// @desc    Get all active elections and their candidates
const getElections = async (req, res) => {
    try {
        const elections = await prisma.committeeElection.findMany({
            where: { tenantId: req.user.tenantId, status: 1 },
            include: {
                committee: true,
                candidates: {
                    where: { status: 1 },
                    include: {
                        user: { select: { name: true, email: true } },
                        designation: true
                    }
                }
            }
        });
        res.json(elections);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

// @desc    Cast a vote securely
const castVote = async (req, res) => {
    try {
        const { electionId, candidateId, designationId } = req.body;
        const voterId = req.user.id;

        // Prisma Transaction for Election Integrity
        const result = await prisma.$transaction(async (tx) => {
            
            // 1. Double-Voting Check (Though @@unique handles this, doing it here gives a cleaner error message)
            const existingVote = await tx.committeeVote.findUnique({
                where: {
                    electionId_voterId_designationId: {
                        electionId: parseInt(electionId),
                        voterId: voterId,
                        designationId: parseInt(designationId)
                    }
                }
            });

            if (existingVote) throw new Error("Security Block: You have already cast a vote for this position.");

            // 2. Record the Vote
            const vote = await tx.committeeVote.create({
                data: {
                    tenantId: req.user.tenantId,
                    electionId: parseInt(electionId),
                    voterId: voterId,
                    candidateId: parseInt(candidateId),
                    designationId: parseInt(designationId)
                }
            });

            // 3. Increment Candidate's Tally
            await tx.committeeCandidate.update({
                where: { id: parseInt(candidateId) },
                data: { votes_count: { increment: 1 } }
            });

            return vote;
        });

        res.status(200).json({ message: 'Vote cast successfully!', data: result });
    } catch (error) { res.status(400).json({ message: error.message }); }
};

// @desc    DEV UTILITY: Automatically seed an election to test
const setupTestElection = async (req, res) => {
    try {
        const tenantId = req.user.tenantId;

        // Create base requirements
        const category = await prisma.committeeCategory.create({ data: { tenantId, name: "Alumni Board" } });
        const designation = await prisma.committeeDesignation.create({ data: { tenantId, name: "President" } });
        
        const committee = await prisma.committee.create({
            data: { tenantId, categoryId: category.id, name: "Global Alumni Association 2026" }
        });

        const election = await prisma.committeeElection.create({
            data: {
                tenantId, committeeId: committee.id, title: "2026 Presidential Election",
                start_date: new Date(), end_date: new Date(new Date().setDate(new Date().getDate() + 7))
            }
        });

        // Add the currently logged in user as a candidate for President!
        await prisma.committeeCandidate.create({
            data: {
                tenantId, electionId: election.id, userId: req.user.id, designationId: designation.id,
                manifesto: "I promise to build a great alumni network!", status: 1
            }
        });

        res.json({ message: "Test Election created successfully!" });
    } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { getElections, castVote, setupTestElection };