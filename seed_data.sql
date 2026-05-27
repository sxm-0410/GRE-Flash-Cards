-- Clean up existing data to avoid duplicates for this refresh
TRUNCATE TABLE word_list_items;
DELETE FROM words;
DELETE FROM word_lists;

-- Create three word lists
INSERT INTO word_lists (name, difficulty, tier_access) 
VALUES ('High-Frequency GRE Words', 'Intermediate', 'free');

INSERT INTO word_lists (name, difficulty, tier_access) 
VALUES ('Barron''s Essential 333', 'Foundational', 'free');

INSERT INTO word_lists (name, difficulty, tier_access) 
VALUES ('Advanced GRE Vocabulary', 'Advanced', 'free');

-- Insert words and link them to lists
DO $$ 
DECLARE 
    hf_list_id UUID;
    be_list_id UUID;
    adv_list_id UUID;
    word_id UUID;
BEGIN
    -- Get the IDs of the lists
    SELECT id INTO hf_list_id FROM word_lists WHERE name = 'High-Frequency GRE Words' LIMIT 1;
    SELECT id INTO be_list_id FROM word_lists WHERE name = 'Barron''s Essential 333' LIMIT 1;
    SELECT id INTO adv_list_id FROM word_lists WHERE name = 'Advanced GRE Vocabulary' LIMIT 1;

    ---------------------------------------------------------------------------
    -- LIST 1: High-Frequency GRE Words (24 words)
    ---------------------------------------------------------------------------
    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Abate', 'verb', 'To become less active, less intense, or less in amount.', 'As I began my speech, my feelings of nervousness quickly abated.', 'Subside', 'Intensify', 'Foundational') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (hf_list_id, word_id);

    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Aberration', 'noun', 'A departure from what is normal, usual, or expected.', 'The power outage was an aberration; the grid is usually very reliable.', 'Anomaly', 'Normality', 'Intermediate') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (hf_list_id, word_id);

    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Aesthetic', 'adjective', 'Concerned with beauty or the appreciation of beauty.', 'The new building has a very modern aesthetic.', 'Artistic', 'Unattractive', 'Intermediate') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (hf_list_id, word_id);

    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Amicable', 'adjective', 'Having a spirit of friendliness; without serious disagreement.', 'Despite their differences, they reached an amicable settlement.', 'Friendly', 'Hostile', 'Intermediate') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (hf_list_id, word_id);

    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Boisterous', 'adjective', 'Noisy, energetic, and cheerful; rowdy.', 'The boisterous crowd cheered loudly for their team.', 'Energetic', 'Quiet', 'Intermediate') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (hf_list_id, word_id);

    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Brazen', 'adjective', 'Bold and without shame.', 'He told a brazen lie even though the truth was obvious.', 'Bold', 'Timid', 'Intermediate') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (hf_list_id, word_id);

    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Condescending', 'adjective', 'Having or showing a feeling of patronizing superiority.', 'His condescending tone made it difficult to work with him.', 'Patronizing', 'Humble', 'Intermediate') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (hf_list_id, word_id);

    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Conformist', 'noun', 'A person who conforms to accepted behavior or established practices.', 'He was never a conformist and always liked to do things his own way.', 'Traditionalist', 'Rebel', 'Intermediate') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (hf_list_id, word_id);

    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Digression', 'noun', 'A temporary departure from the main subject in speech or writing.', 'After a brief digression about his childhood, he returned to the lecture.', 'Deviation', 'Directness', 'Intermediate') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (hf_list_id, word_id);

    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Discredit', 'verb', 'Harm the good reputation of someone or something.', 'The evidence was intended to discredit the witness''s testimony.', 'Disgrace', 'Honor', 'Intermediate') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (hf_list_id, word_id);

    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Ephemeral', 'adjective', 'Lasting for a very short time.', 'The beauty of sunset is ephemeral.', 'Fleeting', 'Permanent', 'Intermediate') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (hf_list_id, word_id);

    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Forbearance', 'noun', 'Patient self-control; restraint and tolerance.', 'He showed great forbearance in the face of provocation.', 'Patience', 'Impatience', 'Intermediate') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (hf_list_id, word_id);

    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Haughty', 'adjective', 'Arrogantly superior and disdainful.', 'She threw him a haughty look before turning away.', 'Arrogant', 'Humble', 'Intermediate') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (hf_list_id, word_id);

    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Impetuous', 'adjective', 'Acting or done quickly and without thought or care.', 'Her decision to quit her job was impetuous.', 'Impulsive', 'Cautious', 'Intermediate') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (hf_list_id, word_id);

    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Inevitability', 'noun', 'The quality of being certain to happen.', 'They accepted the inevitability of change.', 'Certainty', 'Uncertainty', 'Intermediate') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (hf_list_id, word_id);

    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Jubilation', 'noun', 'A feeling of great happiness and triumph.', 'There was great jubilation when the team won.', 'Exultation', 'Despair', 'Intermediate') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (hf_list_id, word_id);

    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Lobbyist', 'noun', 'A person who takes part in an organized attempt to influence legislators.', 'The lobbyist argued for stricter environmental laws.', 'Advocate', 'Opponent', 'Intermediate') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (hf_list_id, word_id);

    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Mundane', 'adjective', 'Lacking interest or excitement; dull.', 'I was tired of the mundane tasks of my job.', 'Ordinary', 'Extraordinary', 'Intermediate') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (hf_list_id, word_id);

    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Nonchalant', 'adjective', 'Feeling or appearing casually calm and relaxed.', 'She gave a nonchalant shrug.', 'Calm', 'Anxious', 'Intermediate') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (hf_list_id, word_id);

    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Ostentatious', 'adjective', 'Characterized by vulgar or pretentious display.', 'The house was decorated in an ostentatious style.', 'Showy', 'Modest', 'Intermediate') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (hf_list_id, word_id);

    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Parched', 'adjective', 'Extremely thirsty.', 'I was parched after the long run.', 'Dry', 'Wet', 'Intermediate') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (hf_list_id, word_id);

    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Pragmatic', 'adjective', 'Dealing with things sensibly and realistically.', 'She took a pragmatic approach to the problem.', 'Practical', 'Idealistic', 'Intermediate') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (hf_list_id, word_id);

    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Querulous', 'adjective', 'Complaining in a petulant or whining manner.', 'The child had a querulous tone.', 'Whiny', 'Cheerful', 'Intermediate') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (hf_list_id, word_id);

    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Reclusive', 'adjective', 'Avoiding the company of other people.', 'The author became increasingly reclusive.', 'Solitary', 'Sociable', 'Intermediate') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (hf_list_id, word_id);


    ---------------------------------------------------------------------------
    -- LIST 2: Barron's Essential 333 (24 words)
    ---------------------------------------------------------------------------
    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Abstain', 'verb', 'Restrain oneself from doing or enjoying something.', 'He chose to abstain from alcohol for the duration of the training.', 'Refrain', 'Indulge', 'Foundational') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (be_list_id, word_id);

    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Adversity', 'noun', 'Difficulties; misfortune.', 'She showed great resilience in the face of adversity.', 'Hardship', 'Prosperity', 'Foundational') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (be_list_id, word_id);

    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Arid', 'adjective', 'Having little or no rain; too dry or barren to support vegetation.', 'The desert landscape was beautiful but incredibly arid.', 'Dry', 'Wet', 'Foundational') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (be_list_id, word_id);

    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Benevolent', 'adjective', 'Well meaning and kindly.', 'The benevolent neighbor offered to help with the gardening.', 'Kind', 'Malevolent', 'Foundational') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (be_list_id, word_id);

    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Collaborate', 'verb', 'Work jointly on an activity, especially to produce or create something.', 'Researchers from different universities collaborated on the study.', 'Cooperate', 'Compete', 'Foundational') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (be_list_id, word_id);

    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Compassion', 'noun', 'Sympathetic pity and concern for the sufferings or misfortunes of others.', 'The nurse showed great compassion toward her patients.', 'Empathy', 'Indifference', 'Foundational') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (be_list_id, word_id);

    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Conditional', 'adjective', 'Subject to one or more conditions or requirements being met.', 'The job offer was conditional on a successful background check.', 'Dependent', 'Absolute', 'Foundational') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (be_list_id, word_id);

    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Diligent', 'adjective', 'Having or showing care and conscientiousness in one''s work or duties.', 'She is a diligent student who always finishes her assignments on time.', 'Industrious', 'Lazy', 'Foundational') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (be_list_id, word_id);

    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Emulate', 'verb', 'Match or surpass a person or achievement, typically by imitation.', 'He tried to emulate the success of his older brother.', 'Imitate', 'Neglect', 'Foundational') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (be_list_id, word_id);

    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Frugal', 'adjective', 'Sparing or economical with regard to money or food.', 'He led a frugal life, saving every penny.', 'Thrifty', 'Extravagant', 'Foundational') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (be_list_id, word_id);

    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Garrulous', 'adjective', 'Excessively talkative, especially on trivial matters.', 'The garrulous neighbor kept us for an hour.', 'Talkative', 'Taciturn', 'Foundational') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (be_list_id, word_id);

    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Hedonist', 'noun', 'A person who believes that the pursuit of pleasure is the most important thing in life.', 'She was a hedonist who spent all her money on travel.', 'Pleasure-seeker', 'Ascetic', 'Foundational') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (be_list_id, word_id);

    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Integrity', 'noun', 'The quality of being honest and having strong moral principles.', 'He is a man of great integrity.', 'Honesty', 'Dishonesty', 'Foundational') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (be_list_id, word_id);

    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Lethargic', 'adjective', 'Affected by lethargy; sluggish and apathetic.', 'I felt lethargic after the long flight.', 'Sluggish', 'Energetic', 'Foundational') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (be_list_id, word_id);

    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Miser', 'noun', 'A person who hoards wealth and spends as little money as possible.', 'The miser refused to donate to charity.', 'Penny-pincher', 'Spendthrift', 'Foundational') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (be_list_id, word_id);

    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Novice', 'noun', 'A person new to or inexperienced in a field or situation.', 'He was a novice at chess.', 'Beginner', 'Expert', 'Foundational') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (be_list_id, word_id);

    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Orator', 'noun', 'A public speaker, especially one who is eloquent or skilled.', 'He was a great orator who could move crowds.', 'Speaker', 'Listener', 'Foundational') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (be_list_id, word_id);

    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Pacify', 'verb', 'Quell the anger, agitation, or excitement of.', 'He tried to pacify the crying baby.', 'Soothe', 'Enrage', 'Foundational') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (be_list_id, word_id);

    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Prudence', 'noun', 'The quality of being prudent; cautiousness.', 'We must exercise prudence in our spending.', 'Caution', 'Rashness', 'Foundational') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (be_list_id, word_id);

    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Rancor', 'noun', 'Bitterness or resentfulness, especially when long-standing.', 'There was no rancor between the two former rivals.', 'Bitterness', 'Goodwill', 'Foundational') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (be_list_id, word_id);

    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Sagacity', 'noun', 'The quality of being sagacious; wisdom.', 'He showed great sagacity in his business dealings.', 'Wisdom', 'Folly', 'Foundational') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (be_list_id, word_id);

    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Tactful', 'adjective', 'Having or showing skill and sensitivity in dealing with others or with difficult issues.', 'She gave a tactful response to the difficult question.', 'Diplomatic', 'Tactless', 'Foundational') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (be_list_id, word_id);

    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Venerable', 'adjective', 'Accorded a great deal of respect, especially because of age, wisdom, or character.', 'The venerable professor was loved by all.', 'Respected', 'Disreputable', 'Foundational') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (be_list_id, word_id);

    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Wary', 'adjective', 'Feeling or showing caution about possible dangers or problems.', 'He was wary of strangers.', 'Cautious', 'Trusting', 'Foundational') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (be_list_id, word_id);


    ---------------------------------------------------------------------------
    -- LIST 3: Advanced GRE Vocabulary (24 words)
    ---------------------------------------------------------------------------
    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Anachronistic', 'adjective', 'Belonging to a period other than that being portrayed.', 'The use of a smartphone in the historical drama was anachronistic.', 'Outdated', 'Contemporary', 'Advanced') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (adv_list_id, word_id);

    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Capitulate', 'verb', 'Cease to resist an opponent or an unwelcome demand; surrender.', 'The army finally had to capitulate after weeks of siege.', 'Surrender', 'Resist', 'Advanced') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (adv_list_id, word_id);

    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Convergence', 'noun', 'The process or state of converging.', 'The convergence of the two rivers created a powerful current.', 'Meeting', 'Divergence', 'Advanced') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (adv_list_id, word_id);

    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Deleterious', 'adjective', 'Causing harm or damage.', 'The chemical spill had a deleterious effect on the local ecosystem.', 'Harmful', 'Beneficial', 'Advanced') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (adv_list_id, word_id);

    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Demagogue', 'noun', 'A political leader who seeks support by appealing to the desires and prejudices of ordinary people.', 'The speaker was accused of being a demagogue who manipulated emotions.', 'Agitator', 'Statesman', 'Advanced') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (adv_list_id, word_id);

    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Disdain', 'noun', 'The feeling that someone or something is unworthy of one''s consideration or respect.', 'He looked at the weapon with clear disdain.', 'Contempt', 'Respect', 'Advanced') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (adv_list_id, word_id);

    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Enervating', 'adjective', 'Causing one to feel drained of energy or vitality.', 'The heat was enervating.', 'Exhausting', 'Invigorating', 'Advanced') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (adv_list_id, word_id);

    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Florid', 'adjective', 'Elaborately or excessively intricate or complicated.', 'His writing style is too florid for my taste.', 'Ornate', 'Plain', 'Advanced') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (adv_list_id, word_id);

    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Gaudy', 'adjective', 'Extravagantly bright or showy, typically so as to be tasteless.', 'The gaudy decorations were too much.', 'Garish', 'Tasteful', 'Advanced') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (adv_list_id, word_id);

    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Hackneyed', 'adjective', 'Lacking significance through having been overused; unoriginal and trite.', 'The plot was hackneyed and predictable.', 'Cliché', 'Original', 'Advanced') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (adv_list_id, word_id);

    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Iconoclast', 'noun', 'A person who attacks cherished beliefs or institutions.', 'He was an iconoclast who challenged every tradition.', 'Rebel', 'Conformist', 'Advanced') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (adv_list_id, word_id);

    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Juxtaposition', 'noun', 'The fact of two things being seen or placed close together with contrasting effect.', 'The juxtaposition of the old and the new was striking.', 'Comparison', 'Separation', 'Advanced') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (adv_list_id, word_id);

    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Knell', 'noun', 'The sound of a bell, especially when rung solemnly for a death or funeral.', 'The knell signaled the end of an era.', 'Toll', 'Silence', 'Advanced') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (adv_list_id, word_id);

    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Laconic', 'adjective', 'Using very few words.', 'His laconic reply left us wanting more.', 'Brief', 'Verbose', 'Advanced') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (adv_list_id, word_id);

    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Malleable', 'adjective', 'Easily influenced; pliable.', 'Young minds are often malleable.', 'Flexible', 'Rigid', 'Advanced') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (adv_list_id, word_id);

    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Nefarious', 'adjective', 'Wicked or criminal.', 'The nefarious plot was foiled by the police.', 'Wicked', 'Good', 'Advanced') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (adv_list_id, word_id);

    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Obdurate', 'adjective', 'Stubbornly refusing to change one''s opinion or course of action.', 'He remained obdurate despite our pleas.', 'Stubborn', 'Yielding', 'Advanced') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (adv_list_id, word_id);

    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Pugnacious', 'adjective', 'Eager or quick to argue, quarrel, or fight.', 'The pugnacious boy was always in trouble.', 'Combative', 'Peaceable', 'Advanced') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (adv_list_id, word_id);

    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Quixotic', 'adjective', 'Exceedingly idealistic; unrealistic and impractical.', 'It was a quixotic quest that was bound to fail.', 'Idealistic', 'Realistic', 'Advanced') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (adv_list_id, word_id);

    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Rancorous', 'adjective', 'Characterized by bitterness or resentment.', 'The rancorous debate went on for hours.', 'Bitter', 'Friendly', 'Advanced') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (adv_list_id, word_id);

    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Surreptitious', 'adjective', 'Kept secret, especially because it would not be approved of.', 'They had a surreptitious meeting in the park.', 'Secret', 'Open', 'Advanced') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (adv_list_id, word_id);

    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Tenuous', 'adjective', 'Very weak or slight.', 'The connection between the two events was tenuous.', 'Weak', 'Strong', 'Advanced') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (adv_list_id, word_id);

    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Ubiquitous', 'adjective', 'Present, appearing, or found everywhere.', 'Smartphones are ubiquitous these days.', 'Everywhere', 'Rare', 'Advanced') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (adv_list_id, word_id);

    INSERT INTO words (word, part_of_speech, definition, example, synonym, antonym, difficulty)
    VALUES ('Vicissitude', 'noun', 'A change of circumstances or fortune, typically one that is unwelcome or unpleasant.', 'The vicissitudes of life can be hard to bear.', 'Change', 'Stability', 'Advanced') RETURNING id INTO word_id;
    INSERT INTO word_list_items (list_id, word_id) VALUES (adv_list_id, word_id);

END $$;
