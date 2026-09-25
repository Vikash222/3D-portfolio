<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;
class StoreSkillRequest extends FormRequest {
    public function authorize() { return true; }
    public function rules() {
        return [
            'name' => 'required|string|max:100',
            'category' => 'required|in:Languages,Web,Tools,Concepts',
            'proficiency_level' => 'nullable|integer|between:1,5',
            'icon' => 'nullable|string|max:100',
            'display_order' => 'nullable|integer'
        ];
    }
}
