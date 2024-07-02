from flask import Flask, request, jsonify
from flask_cors import CORS
from music21 import *
from musicpy import read as mp_read, write as mp_write
import tempfile
import os

app = Flask(__name__)
CORS(app)

def Music21_analyze(notes_file):
    res = []

    if isinstance(notes_file, stream.Part):
        notes_file = stream.Score([notes_file])  # Wrap the Part in a Score

    for part in notes_file.parts:
        measures = []
        for measure in part.getElementsByClass('Measure'):
            if isinstance(measure, stream.Measure):
                all_notes = []
                measure_elements = measure.flatten().notes
                measure_number = measure.measureNumber
                for element in measure_elements:
                    if isinstance(element, note.Note):
                        note_data = {
                            'pitch': element.pitch.midi,
                            'start_time': float(element.offset),
                            'duration': float(element.quarterLength),
                            'is_chord': False,
                            'measure': measure_number
                        }
                        app.logger.debug(f'measure: {measure_number}, Note: {element.nameWithOctave}')
                        all_notes.append(note_data)
                    elif isinstance(element, chord.Chord):
                        chord_data = {
                            'pitches': [p.midi for p in element.pitches],
                            'start_time': float(element.offset),
                            'duration': float(element.quarterLength),
                            'is_chord': True,
                            'measure': measure_number,
                            'root': element.root().midi,
                            'quality': element.quality
                        }
                        all_notes.append(chord_data)
                        app.logger.debug(f'measure: {measure_number}, chord: {element}')
                    elif isinstance(element, note.Unpitched):
                        app.logger.debug(f'measure: {measure_number}, unpitched: {element.displayName}')
                    elif isinstance(element, percussion.PercussionChord):
                        app.logger.debug(f'measure: {measure_number}, percussion: {element}')
                measures.append({
                    'measureNumber': measure_number,
                    'notes': all_notes
                })
        res.append(measures)

    return res

@app.route('/analyze', methods=['POST'])
def analyze_midi():
    try:
        app.logger.debug('Received request')
        file = request.files['file']
        if file:
            app.logger.debug(f'File received: {file.filename}')
            midi_content = file.read()  # Read the file content as binary

            # Save the binary content to a temporary file
            with tempfile.NamedTemporaryFile(delete=False, suffix='.mid') as temp_file:
                temp_file.write(midi_content)
                temp_file_path = temp_file.name

            # Use the temporary file with musicpy
            a, bpm, start_time = mp_read(temp_file_path).merge()
            app.logger.debug(f'Musicpy: {a, bpm, start_time}')
            file_melody = a.split_melody(mode='chord')
            file_chord = a.split_chord(mode='chord')
            melody_path = 'file_melody.mid'
            chord_path = 'file_chord.mid'
            mp_write(file_melody, bpm, name=melody_path)
            mp_write(file_chord, bpm, name=chord_path)

            # Analyze the melody and chord MIDI files with music21
            melody_midi = converter.parse(melody_path)
            chord_midi = converter.parse(midi_content)

            # Process the original MIDI file with music21
            original_midi = converter.parse(temp_file_path)
            res = Music21_analyze(original_midi)

            # Clean up the temporary files
            os.remove(temp_file_path)
            os.remove(melody_path)
            os.remove(chord_path)

            # Return the notes data as JSON
            return jsonify(res), 200

        else:
            return jsonify({'error': 'No file provided'}), 400
    except Exception as e:
        app.logger.error('Error processing request', exc_info=True)
        return jsonify({'error': 'Internal Server Error', 'message': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
